import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Deals ──────────────────────────────────────────────────────────────────
export async function fetchDeals(workspaceId) {
  if (!supabase) return null
  const query = supabase.from('deals').select('*').order('date', { ascending: false })
  if (workspaceId) query.or(`workspace_id.eq.${workspaceId},source.eq.seed`)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function upsertDeal(deal) {
  if (!supabase) return null
  const { data, error } = await supabase.from('deals').upsert(deal).select().single()
  if (error) throw error
  return data
}

export async function updateDealStatus(id, patch) {
  if (!supabase) return null
  const { data, error } = await supabase.from('deals').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function insertDeal(deal) {
  if (!supabase) return null
  const { data, error } = await supabase.from('deals').insert(deal).select().single()
  if (error) throw error
  return data
}

// ─── Pipeline log ────────────────────────────────────────────────────────────
export async function logPipelineAction(dealId, action, note = '') {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('pipeline_log')
    .insert({ deal_id: dealId, action, note })
    .select().single()
  if (error) throw error
  return data
}

// ─── Workspaces ──────────────────────────────────────────────────────────────
export async function getOrCreateWorkspace(userId, userEmail) {
  if (!supabase) return null

  // Check existing membership
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (membership?.workspace_id) return membership.workspace_id

  // Create new workspace
  const name = `${userEmail?.split('@')[0]}'s Workspace`
  const { data: workspace, error } = await supabase
    .from('workspaces')
    .insert({ name, created_by: userId })
    .select()
    .single()

  if (error) throw error

  await supabase.from('workspace_members').insert({
    workspace_id: workspace.id,
    user_id: userId,
    role: 'owner',
  })

  return workspace.id
}

export async function joinWorkspaceByCode(userId, inviteCode) {
  if (!supabase) return null
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('invite_code', inviteCode)
    .single()

  if (!workspace) throw new Error('Invalid invite code')

  await supabase.from('workspace_members').upsert({
    workspace_id: workspace.id,
    user_id: userId,
    role: 'member',
  })

  return workspace.id
}

export async function getWorkspaceInviteCode(workspaceId) {
  if (!supabase || !workspaceId) return null
  const { data } = await supabase
    .from('workspaces')
    .select('invite_code, name')
    .eq('id', workspaceId)
    .single()
  return data
}

export async function getWorkspaceMembers(workspaceId) {
  if (!supabase || !workspaceId) return []
  const { data } = await supabase
    .from('workspace_members')
    .select('user_id, role, joined_at')
    .eq('workspace_id', workspaceId)
  return data || []
}

// ─── CRM Notes ───────────────────────────────────────────────────────────────
export async function fetchCRMNotes(userId) {
  if (!supabase || !userId) return []
  const { data, error } = await supabase
    .from('crm_notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function insertCRMNote(note) {
  if (!supabase) return null
  const { data, error } = await supabase.from('crm_notes').insert(note).select().single()
  if (error) throw error
  return data
}

export async function updateCRMNote(id, patch) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('crm_notes')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select().single()
  if (error) throw error
  return data
}

export async function deleteCRMNote(id) {
  if (!supabase) return null
  const { error } = await supabase.from('crm_notes').delete().eq('id', id)
  if (error) throw error
}

export async function uploadCRMFile(userId, file) {
  if (!supabase) return null
  const path = `${userId}/${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage
    .from('crm-files')
    .upload(path, file)
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('crm-files').getPublicUrl(path)
  return { path, url: publicUrl, name: file.name }
}
