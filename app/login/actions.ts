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
			redirectTo: `${process.env.NEXT_PUBLIC_URL  || 'http://localhost:3000'}/api/auth/callback?next=${next}`,
		},
	});
	console.log("login data", data)
	console.log("login error", error)
	console.log("login url", process.env.NEXT_PUBLIC_URL )
	if (error) {
		console.error('Login Action - OAuth error:', error);
		throw error;
	}

	
	return redirect(data.url);
}