'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  company_name: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  country: z.string().optional(),
  industry: z.string().optional(),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ClientModal({ client, onClose, onSaved }: { client?: any; onClose: () => void; onSaved: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: client || {}
  })

  async function onSubmit(data: FormData) {
    const payload = { ...data, updated_at: new Date().toISOString() }
    if (client?.id) {
      const { error } = await supabase.from('clients').update(payload).eq('id', client.id)
      if (error) { toast.error('Failed to update client'); return }
      // Log timeline
      await supabase.from('client_timeline').insert({ client_id: client.id, event: 'Client updated', event_type: 'update' })
      toast.success('Client updated!')
    } else {
      const { data: inserted, error } = await supabase.from('clients').insert(payload).select().single()
      if (error) { toast.error('Failed to add client'); return }
      if (inserted) await supabase.from('client_timeline').insert({ client_id: inserted.id, event: 'Client created', event_type: 'create' })
      toast.success('Client added!')
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="section-title">{client ? 'Edit Client' : 'Add Client'}</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-surface-2 text-muted hover:text-text"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input" {...register('full_name')} />
              {errors.full_name && <p className="text-error text-xs mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="label">Company Name</label>
              <input className="input" {...register('company_name')} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" {...register('email')} />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" {...register('phone')} />
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <input className="input" {...register('whatsapp')} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" {...register('country')} />
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" {...register('industry')} />
            </div>
            <div>
              <label className="label">Website URL</label>
              <input className="input" {...register('website_url')} />
              {errors.website_url && <p className="text-error text-xs mt-1">{errors.website_url.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input min-h-[80px] resize-none" {...register('notes')} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? 'Saving...' : client ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
