'use client'
import { Bell, Search } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store'

export default function Topbar() {
  const { notificationCount } = useAppStore()
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search size={16} className="text-muted" />
        <input
          type="text"
          placeholder="Search clients, projects, invoices..."
          className="bg-transparent text-sm text-text placeholder:text-muted focus:outline-none w-full"
        />
      </div>
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-surface-2 text-muted hover:text-text transition-colors">
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Link>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
          F
        </div>
      </div>
    </header>
  )
}
