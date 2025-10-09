import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('google_access_token')?.value

  return NextResponse.json({
    isLoggedIn: !!accessToken,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!cookieStore.get('google_refresh_token')?.value
  })
}