export async function getEpisode(episodeUrl: string) {
	try {

		// unstable_cache를 사용하여 명시적으로 캐싱
		const response = await fetch(episodeUrl, {
			cache: "force-cache",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch episode: ${response.status}`);
		}

		const mdContent = await response.text();
		const episodeBodyText = mdContent
			.replace(/\\n/g, "\n")
			.replace(/\r\n/g, "\n")
			.replace(/\n\s*\n/g, "\n\n")
			.trim();

		return episodeBodyText;
	} catch (error) {
		console.error("Error fetching episode body:", error);
		throw new Error("Error fetching episode body");
	}
}
