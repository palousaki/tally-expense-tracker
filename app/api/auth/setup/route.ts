import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_CATEGORIES } from '@/lib/categories'

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Idempotent: skip if user already exists
    const existing = await prisma.user.findUnique({ where: { id: userId } })
    if (existing) {
      return NextResponse.json({ ok: true })
    }

    await prisma.user.create({
      data: {
        id: userId,
        email,
        name: name ?? null,
        categories: {
          create: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, isDefault: true })),
        },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
