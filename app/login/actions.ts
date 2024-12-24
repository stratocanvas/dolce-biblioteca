"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
	const supabase = await createClient();
	const next = formData.get('next')?.toString() ?? '/';

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			queryParams: {
					access_type: 'offline',
					prompt: 'consent',
			},
			redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback?next=${next}`,
		},
	});
	console.log(data, error)
	console.log(process.env.NEXT_PUBLIC_SITE_URL)
	if (error) {
		console.error('Login Action - OAuth error:', error);
		throw error;
	}

	
	return redirect(data.url);
}