import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    if (!type || !data) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('support')
      .insert([{
        type,
        body: data,
      }])

    if (error) {
      console.error('Error inserting support request:', error)
      return NextResponse.json(
        { error: '오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing support request:', error)
    return NextResponse.json(
      { error: '오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 