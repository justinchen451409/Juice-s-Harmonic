import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Deals
export async function fetchDeals() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function upsertDeal(deal) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('deals')
    .upsert(deal)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDealStatus(id, patch) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('deals')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function seedDealsIfEmpty(deals) {
  if (!supabase) return
  const { count } = await supabase
    .from('deals')
    .select('*', { count: 'exact', head: true })
  if (count === 0) {
    const { error } = await supabase.from('deals').insert(deals)
    if (error) console.warn('Seed error:', error)
  }
}

// Pipeline log
export async function logPipelineAction(dealId, action, note = '') {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('pipeline_log')
    .insert({ deal_id: dealId, action, note })
    .select()
    .single()
  if (error) throw error
  return data
}
