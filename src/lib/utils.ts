import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'SAR') {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-SA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date))
}

export function generateInvoiceNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000) + 1000
  return `FW-${year}${month}-${random}`
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    'Pending': 'text-warning bg-warning/10',
    'In Progress': 'text-primary bg-primary/10',
    'Waiting Client Review': 'text-yellow-400 bg-yellow-400/10',
    'Completed': 'text-success bg-success/10',
    'Draft': 'text-muted bg-muted/10',
    'Sent': 'text-primary bg-primary/10',
    'Paid': 'text-success bg-success/10',
    'Overdue': 'text-error bg-error/10',
    'Lead': 'text-muted bg-muted/10',
    'Discovery Call': 'text-blue-400 bg-blue-400/10',
    'Deal in Meeting': 'text-yellow-400 bg-yellow-400/10',
    'Paid Deposit 50%': 'text-primary bg-primary/10',
    'Review': 'text-warning bg-warning/10',
    'Completed Paid 50%': 'text-success bg-success/10',
  }
  return map[status] || 'text-muted bg-muted/10'
}
