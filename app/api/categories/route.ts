import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
  })

  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, icon, colorKey } = body

  if (!name || !icon || !colorKey) {
    return NextResponse.json({ error: 'name, icon, and colorKey are required' }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: { userId: user.id, name, icon, colorKey },
  })

  return NextResponse.json(category, { status: 201 })
}
