'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import {
  TrendingUp, TrendingDown, Users, FolderKanban,
  FileText, DollarSign, AlertCircle, CheckCircle2
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Link from 'next/link'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalExpenses: 0, totalProfit: 0,
    outstandingInvoices: 0, activeProjects: 0, completedProjects: 0,
    totalClients: 0, unpaidCount: 0
  })
  const [recentClients, setRecentClients] = useState<any[]>([])
  const [unpaidInvoices, setUnpaidInvoices] = useState<any[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    const [invoicesRes, expensesRes, projectsRes, clientsRes] = await Promise.all([
      supabase.from('invoices').select('*, clients(full_name, company_name)'),
      supabase.from('expenses').select('*'),
      supabase.from('projects').select('*, clients(full_name)'),
      supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    const invoices = invoicesRes.data || []
    const expenses = expensesRes.data || []
    const projects = projectsRes.data || []
    const clients = clientsRes.data || []

    const paidInvoices = invoices.filter(i => i.status === 'Paid')
    const totalRevenue = paidInvoices.reduce((s, i) => s + (i.total || 0), 0)
    const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0)
    const outstanding = invoices.filter(i => ['Sent','Overdue'].includes(i.status))
    const outstandingAmount = outstanding.reduce((s, i) => s + (i.total || 0), 0)

    setStats({
      totalRevenue, totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      outstandingInvoices: outstandingAmount,
      activeProjects: projects.filter(p => p.status === 'In Progress').length,
      completedProjects: projects.filter(p => p.status === 'Completed').length,
      totalClients: clients.length,
      unpaidCount: outstanding.length,
    })

    setRecentClients(clients.slice(0, 5))
    setUnpaidInvoices(outstanding.slice(0, 5))

    const today = new Date()
    const upcoming = projects
      .filter(p => p.deadline && p.status !== 'Completed')
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5)
    setUpcomingDeadlines(upcoming)

    // Build monthly chart data
    const monthly: Record<string, { revenue: number; expenses: number }> = {}
    MONTHS.forEach(m => { monthly[m] = { revenue: 0, expenses: 0 } })
    paidInvoices.forEach(i => {
      const m = MONTHS[new Date(i.created_at).getMonth()]
      if (monthly[m]) monthly[m].revenue += i.total || 0
    })
    expenses.forEach(e => {
      const m = MONTHS[new Date(e.date).getMonth()]
      if (monthly[m]) monthly[m].expenses += e.amount || 0
    })
    setChartData(MONTHS.map(m => ({ month: m, revenue: monthly[m].revenue, expenses: monthly[m].expenses, profit: monthly[m].revenue - monthly[m].expenses })))
  }

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Profit', value: formatCurrency(stats.totalProfit), icon: DollarSign, color: 'text-primary-light', bg: 'bg-primary/10' },
    { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses), icon: TrendingDown, color: 'text-error', bg: 'bg-error/10' },
    { label: 'Outstanding', value: formatCurrency(stats.outstandingInvoices), icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'text-primary-light', bg: 'bg-primary/10' },
    { label: 'Completed Projects', value: stats.completedProjects, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Unpaid Invoices', value: stats.unpaidCount, icon: FileText, color: 'text-error', bg: 'bg-error/10' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back — here's your agency overview.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-muted text-xs">{label}</p>
              <p className="text-text font-semibold text-lg leading-tight truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '8px', color: '#e8e8e8' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#rev)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#exp)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title mb-4">Monthly Profit</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: '8px', color: '#e8e8e8' }} />
              <Bar dataKey="profit" fill="#10b981" radius={[4,4,0,0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Clients */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Clients</h3>
            <Link href="/clients" className="text-xs text-primary hover:text-primary-light">View all</Link>
          </div>
          <div className="space-y-3">
            {recentClients.length === 0 && <p className="text-muted text-sm">No clients yet.</p>}
            {recentClients.map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary-light text-sm font-semibold">
                  {c.full_name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-text font-medium truncate">{c.full_name}</p>
                  <p className="text-xs text-muted truncate">{c.company_name || c.country || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unpaid Invoices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Unpaid Invoices</h3>
            <Link href="/invoices" className="text-xs text-primary hover:text-primary-light">View all</Link>
          </div>
          <div className="space-y-3">
            {unpaidInvoices.length === 0 && <p className="text-muted text-sm">All invoices paid!</p>}
            {unpaidInvoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-text font-medium truncate">{inv.invoice_number}</p>
                  <p className="text-xs text-muted">{inv.clients?.full_name || '—'}</p>
                </div>
                <span className={`badge ${
                  inv.status === 'Overdue' ? 'text-error bg-error/10' : 'text-warning bg-warning/10'
                }`}>{formatCurrency(inv.total, inv.currency)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Upcoming Deadlines</h3>
            <Link href="/projects" className="text-xs text-primary hover:text-primary-light">View all</Link>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 && <p className="text-muted text-sm">No upcoming deadlines.</p>}
            {upcomingDeadlines.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-text font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted">{p.clients?.full_name || '—'}</p>
                </div>
                <span className="text-xs text-warning">{p.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
