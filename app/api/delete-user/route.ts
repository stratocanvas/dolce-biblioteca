import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	// Create a Supabase client with server-side auth to get current user
	const supabase = await createClient()

	// Get the current user using server-side auth
	const { data: { user }, error: userError } = await supabase.auth.getUser()

	if (userError || !user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	// Create an admin client for deletion
	const adminClient = createAdminClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL || '',
		process.env.SUPABASE_SERVICE_ROLE_KEY || '',
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		}
	)

	// Delete the user using admin API
	const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

	if (deleteError) {
		return NextResponse.json({ error: deleteError.message }, { status: 500 })
	}

	// Clear the session
	await supabase.auth.signOut()

	return NextResponse.json({ success: true })
}
