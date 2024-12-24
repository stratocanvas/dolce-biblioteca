import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const novelId = searchParams.get('novel_id')

  if (!novelId) {
    return NextResponse.json({ error: 'Novel ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('favourite')
    .select('id')
    .eq('novel_id', novelId)
    .eq('user_id', user?.id)
    .single()

  return NextResponse.json({ isFavourited: !!data })
}

export async function POST(request: Request) {
  const { novel_id } = await request.json()

  if (!novel_id) {
    return NextResponse.json({ error: 'Novel ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: existingFavourite } = await supabase
    .from('favourite')
    .select('id')
    .eq('novel_id', novel_id)
    .eq('user_id', user?.id)
    .single()

  if (existingFavourite) {
    await supabase
      .from('favourite')
      .delete()
      .eq('id', existingFavourite.id)
    return NextResponse.json({ isFavourited: false })
  }

  await supabase
    .from('favourite')
    .insert([{ novel_id, user_id: user?.id }])
  return NextResponse.json({ isFavourited: true })
} 