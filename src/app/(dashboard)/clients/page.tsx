'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Pencil, Trash2, Phone, Mail, Globe, Building2 } from 'lucide-react'
import ClientModal from '@/components/clients/ClientModal'
import ClientDetail from '@/components/clients/ClientDetail'
import toast from 'react-hot-toast'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editClient, setEditClient] = useState<any>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  useEffect(() => { fetchClients() }, [])

  async function fetchClients() {
    setLoading(true)
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setClients(data || [])
    setLoading(false)
  }

  async function deleteClient(id: string) {
    if (!confirm('Delete this client?')) return
    await supabase.from('clients').delete().eq('id', id)
    toast.success('Client deleted')
    fetchClients()
  }

  const filtered = clients.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="text-muted text-sm mt-1">{clients.length} total clients</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditClient(null); setShowModal(true) }}>
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          className="input pl-10"
          placeholder="Search by name, company, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Client','Company','Email','Phone','Country','Actions'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted">Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center">
                <p className="text-muted">No clients found.</p>
                <button className="btn-primary mt-4 mx-auto" onClick={() => setShowModal(true)}><Plus size={16} />Add your first client</button>
              </td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-surface-2 transition-colors cursor-pointer" onClick={() => setSelectedClient(c)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary-light text-sm font-semibold flex-shrink-0">
                      {c.full_name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-text font-medium">{c.full_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  <div className="flex items-center gap-1"><Building2 size={13} />{c.company_name || '—'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  <div className="flex items-center gap-1"><Mail size={13} />{c.email || '—'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-muted">
                  <div className="flex items-center gap-1"><Phone size={13} />{c.phone || '—'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-muted">{c.country || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button className="p-1.5 rounded hover:bg-surface-3 text-muted hover:text-text transition-colors" onClick={() => { setEditClient(c); setShowModal(true) }}><Pencil size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-error/10 text-muted hover:text-error transition-colors" onClick={() => deleteClient(c.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ClientModal
          client={editClient}
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchClients() }}
        />
      )}
      {selectedClient && (
        <ClientDetail
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onEdit={() => { setEditClient(selectedClient); setSelectedClient(null); setShowModal(true) }}
        />
      )}
    </div>
  )
}
