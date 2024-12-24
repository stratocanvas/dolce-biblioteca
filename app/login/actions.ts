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
			redirectTo: process.env.NODE_ENV === 'production'
				? `${process.env.NEXT_PUBLIC_URL}/api/auth/callback?next=${next}`
				: `http://localhost:3000/api/auth/callback?next=${next}`,
		},
	});
	if (error) {
		console.error('Login Action - OAuth error:', error);
		throw error;
	}

	
	return redirect(data.url);
}