export type ColorKey =
  | 'purple'
  | 'teal'
  | 'amber'
  | 'coral'
  | 'blue'
  | 'pink'
  | 'green'
  | 'red'
  | 'gray'

export const COLOR_MAP: Record<
  ColorKey,
  {
    bg: string
    text: string
    bar: string
    border: string
    hex: string
  }
> = {
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    bar: 'bg-purple-500',
    border: 'border-purple-300',
    hex: '#7F77DD',
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    bar: 'bg-teal-500',
    border: 'border-teal-300',
    hex: '#1D9E75',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    bar: 'bg-amber-500',
    border: 'border-amber-300',
    hex: '#EF9F27',
  },
  coral: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    bar: 'bg-orange-500',
    border: 'border-orange-300',
    hex: '#D85A30',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    bar: 'bg-blue-500',
    border: 'border-blue-300',
    hex: '#378ADD',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    bar: 'bg-pink-500',
    border: 'border-pink-300',
    hex: '#D4537E',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    bar: 'bg-green-500',
    border: 'border-green-300',
    hex: '#639922',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    bar: 'bg-red-500',
    border: 'border-red-300',
    hex: '#E24B4A',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    bar: 'bg-gray-400',
    border: 'border-gray-300',
    hex: '#888780',
  },
}

export const DEFAULT_CATEGORIES: {
  name: string
  icon: string
  colorKey: ColorKey
}[] = [
  { name: 'Food & groceries', icon: '🛒', colorKey: 'purple' },
  { name: 'Transport',        icon: '🚌', colorKey: 'teal' },
  { name: 'Utilities',        icon: '💡', colorKey: 'amber' },
  { name: 'Entertainment',    icon: '🎬', colorKey: 'pink' },
  { name: 'Health',           icon: '💊', colorKey: 'red' },
  { name: 'Shopping',         icon: '🛍️', colorKey: 'blue' },
  { name: 'Dining out',       icon: '🍽️', colorKey: 'coral' },
  { name: 'Other',            icon: '📦', colorKey: 'gray' },
]

export function getCategoryColor(colorKey: string) {
  return COLOR_MAP[colorKey as ColorKey] ?? COLOR_MAP.gray
}
