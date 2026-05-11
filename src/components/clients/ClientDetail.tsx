'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, Clock, Mail, Phone, Globe, Building2, MessageCircle, Pencil } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ClientDetail({ client, onClose, onEdit }: { client: any; onClose: () => void; onEdit: () => void }) {
  const [timeline, setTimeline] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('client_timeline').select('*').eq('client_id', client.id).order('created_at', { ascending: false }).then(({ data }) => setTimeline(data || []))
    supabase.from('client_files').select('*').eq('client_id', client.id).order('uploaded_at', { ascending: false }).then(({ data }) => setFiles(data || []))
  }, [client.id])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/png','image/jpeg','image/svg+xml','application/pdf']
    if (!allowed.includes(file.type)) { toast.error('Only PNG, JPG, SVG, PDF allowed'); return }
    setUploading(true)
    const path = `clients/${client.id}/${Date.now()}_${file.name}`
    const { error: upErr } = await supabase.storage.from('client-files').upload(path, file)
    if (upErr) { toast.error('Upload failed'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('client-files').getPublicUrl(path)
    await supabase.from('client_files').insert({ client_id: client.id, file_name: file.name, file_url: publicUrl, file_type: file.type })
    await supabase.from('client_timeline').insert({ client_id: client.id, event: `File uploaded: ${file.name}`, event_type: 'file' })
    toast.success('File uploaded!')
    setUploading(false)
    const { data } = await supabase.from('client_files').select('*').eq('client_id', client.id)
    setFiles(data || [])
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-light font-bold">{client.full_name?.[0]?.toUpperCase()}</div>
            <div>
              <h2 className="section-title">{client.full_name}</h2>
              <p className="text-muted text-xs">{client.company_name || client.country}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="btn-secondary py-1.5 px-3 text-xs"><Pencil size={13} />Edit</button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-surface-2 text-muted"><X size={18} /></button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Contact Info</h3>
            {client.email && <div className="flex items-center gap-2 text-sm text-text"><Mail size={14} className="text-muted" />{client.email}</div>}
            {client.phone && <div className="flex items-center gap-2 text-sm text-text"><Phone size={14} className="text-muted" />{client.phone}</div>}
            {client.whatsapp && <div className="flex items-center gap-2 text-sm text-text"><MessageCircle size={14} className="text-muted" />{client.whatsapp}</div>}
            {client.website_url && <div className="flex items-center gap-2 text-sm text-text"><Globe size={14} className="text-muted" /><a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{client.website_url}</a></div>}
            {client.industry && <div className="flex items-center gap-2 text-sm text-text"><Building2 size={14} className="text-muted" />{client.industry}</div>}
            {client.notes && <div className="mt-2 p-3 bg-surface-2 rounded-lg text-sm text-muted">{client.notes}</div>}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Files</h3>
              <label className="btn-secondary py-1 px-2 text-xs cursor-pointer">
                <Upload size={12} />{uploading ? 'Uploading...' : 'Upload'}
                <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.svg,.pdf" onChange={handleFileUpload} />
              </label>
            </div>
            <div className="space-y-2">
              {files.map(f => (
                <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-surface-2 rounded hover:bg-surface-3 transition-colors">
                  <span className="text-xs text-primary">{
                    f.file_type?.includes('pdf') ? '📄' : f.file_type?.includes('image') ? '🖼️' : '📁'
                  }</span>
                  <span className="text-xs text-text truncate">{f.file_name}</span>
                </a>
              ))}
              {files.length === 0 && <p className="text-xs text-muted">No files uploaded.</p>}
            </div>
          </div>
        </div>
        {/* Timeline */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Clock size={14} />Timeline</h3>
          <div className="space-y-2">
            {timeline.map(t => (
              <div key={t.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-text">{t.event}</p>
                  <p className="text-xs text-muted">{formatDate(t.created_at)}</p>
                </div>
              </div>
            ))}
            {timeline.length === 0 && <p className="text-xs text-muted">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
