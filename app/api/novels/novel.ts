import { createClient } from "@/utils/supabase/client";

export interface Episode {
	episode_id: string
	title: string
	body: string
	index: number
	bookmark?: boolean
	count: number
}

export interface Novel {
	novel_id: string
	title: string
	author: string
	tags: string[]
	synopsis?: string
	episode: Episode[]
}

export async function getNovel(id: string) {
	const supabase = createClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	const query = supabase
		.from("novel")
		.select(`
      novel_id,
			title,
			synopsis,
			tags,
			author(name),
      episode (
        episode_id,
				novel_id,
				title,
				body,
				index,
				season(season_id, type, season_number, name, sequence),
        bookmark!left (
          id
        )
      )
    `)
		.eq("novel_id", id);
	if (user) {
		query.eq("episode.bookmark.user_id", user.id);
	}

	const { data: novel } = await query.single();
	console.log(novel)
	if (novel) {
		novel.episode = novel.episode.map((ep: Episode) => ({
			...ep,
			bookmarked: ep.bookmark,
		}));
		novel.author = novel.author?.name || '';
	}

	return novel as unknown as Novel;
}

export async function getNovels(page = 1, limit = 10) {
	const supabase = createClient();
	const from = (page - 1) * limit;
	
	const { data: novels, count } = await supabase
		.from("novel")
		.select(`novel_id,
			title,
			synopsis,
			tags,
			author(name),
			episode(count)`, { count: 'exact' })
		.range(from, from + limit - 1)
		.order('novel_id', { ascending: false });

	if (novels) {
		for (const novel of novels) {
			novel.author = novel.author?.name || '';
		}
	}

	return { novels: novels as unknown as Novel[], count: count || 0 };
}

export async function searchNovels(keyword: string, page = 1, limit = 10) {
	const supabase = createClient();
	const offset = (page - 1) * limit;
	
	const { data, error } = await supabase.rpc('search_novel', {
		keyword,
		limit_count: limit,
		offset_count: offset
	});

	if (error) throw error;

	return {
		novels: data as Novel[],
		count: data.length === limit ? -1 : data.length
	};
}
