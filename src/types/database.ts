export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string; full_name: string; company_name: string | null
          email: string | null; phone: string | null; whatsapp: string | null
          country: string | null; industry: string | null; website_url: string | null
          notes: string | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      projects: {
        Row: {
          id: string; client_id: string | null; title: string; service_type: string
          status: string; deadline: string | null; budget: number; cost: number
          currency: string; notes: string | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      pipeline_leads: {
        Row: {
          id: string; client_name: string; company: string | null; email: string | null
          phone: string | null; service: string | null; value: number; currency: string
          stage: string; notes: string | null; follow_up_date: string | null
          meeting_date: string | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pipeline_leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['pipeline_leads']['Insert']>
      }
      invoices: {
        Row: {
          id: string; invoice_number: string; client_id: string | null; status: string
          currency: string; subtotal: number; tax_rate: number; tax_amount: number
          total: number; due_date: string | null; paid_date: string | null; notes: string | null
          signature: string | null; thank_you_message: string | null
          payment_proof_url: string | null; created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
      invoice_items: {
        Row: { id: string; invoice_id: string; description: string; quantity: number; unit_price: number; total: number }
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['invoice_items']['Insert']>
      }
      expenses: {
        Row: {
          id: string; title: string; category: string; amount: number
          currency: string; date: string; notes: string | null; recurring: boolean; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
      }
      notifications: {
        Row: { id: string; title: string; message: string | null; type: string; read: boolean; link: string | null; created_at: string }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      file_vault: {
        Row: {
          id: string; name: string; folder: string; file_url: string; file_type: string | null
          tags: string[] | null; client_id: string | null; notes: string | null; uploaded_at: string
        }
        Insert: Omit<Database['public']['Tables']['file_vault']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['file_vault']['Insert']>
      }
      settings: {
        Row: { id: string; key: string; value: string | null; updated_at: string }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
      client_files: {
        Row: { id: string; client_id: string; file_name: string; file_url: string; file_type: string | null; uploaded_at: string }
        Insert: Omit<Database['public']['Tables']['client_files']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['client_files']['Insert']>
      }
      client_timeline: {
        Row: { id: string; client_id: string; event: string; event_type: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['client_timeline']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['client_timeline']['Insert']>
      }
      project_files: {
        Row: { id: string; project_id: string; file_name: string; file_url: string; file_type: string | null; uploaded_at: string }
        Insert: Omit<Database['public']['Tables']['project_files']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['project_files']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
