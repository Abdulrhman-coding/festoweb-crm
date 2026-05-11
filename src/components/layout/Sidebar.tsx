'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, GitBranch, FolderKanban,
  FileText, TrendingDown, Bell, FolderLock, Settings, ChevronLeft, Zap
} from 'lucide-react'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/expenses', label: 'Expenses', icon: TrendingDown },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/vault', label: 'File Vault', icon: FolderLock },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, notificationCount } = useAppStore()

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-surface border-r border-border flex flex-col z-50 transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-text text-lg">FestoWeb</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-surface-2 text-muted hover:text-text transition-colors"
        >
          <ChevronLeft size={18} className={cn('transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                active
                  ? 'bg-primary/10 text-primary-light'
                  : 'text-muted hover:bg-surface-2 hover:text-text'
              )}
            >
              <div className="relative">
                <Icon size={18} />
                {label === 'Notifications' && notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </div>
              {sidebarOpen && <span>{label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-3 rounded text-xs text-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-border">
                  {label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="px-4 py-4 border-t border-border">
          <p className="text-xs text-faint">FestoWeb CRM v1.0</p>
        </div>
      )}
    </aside>
  )
}
