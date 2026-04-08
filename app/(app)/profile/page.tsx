import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_CATEGORIES } from '@/lib/categories'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Ensure the Prisma user record exists (may be missing if email confirmation
  // was required at signup and /api/auth/setup never ran)
  let dbUser = await prisma.user.findUnique({ where: { id: user.id } })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: (user.user_metadata?.name as string) ?? null,
        avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
        categories: {
          create: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, isDefault: true })),
        },
      },
    })
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
  })

  return (
    <ProfileClient
      user={JSON.parse(JSON.stringify(dbUser))}
      initialCategories={JSON.parse(JSON.stringify(categories))}
    />
  )
}
