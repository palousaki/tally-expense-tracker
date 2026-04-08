import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_CATEGORIES } from '@/lib/categories'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data.user) {
      // Ensure user record exists in Prisma
      const existing = await prisma.user.findUnique({ where: { id: data.user.id } })
      if (!existing) {
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            name: (data.user.user_metadata?.name as string) ?? null,
            avatar_url: (data.user.user_metadata?.avatar_url as string) ?? null,
            categories: {
              create: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, isDefault: true })),
            },
          },
        })
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
