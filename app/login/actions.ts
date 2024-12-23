"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
	const supabase = await createClient();
	console.log('FormData entries:', [...formData.entries()]);
	const next = formData.get('next')?.toString() ?? '/';
	console.log('Next parameter:', next);
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			queryParams: {
				access_type: 'offline',
				prompt: 'consent',
			},
			redirectTo: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/${next}`,
		},
	});

	if (error) {
		throw error;
	}
  console.log(data.url);
  console.log(next);
	return redirect(data.url);
}