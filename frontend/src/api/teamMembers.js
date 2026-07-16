import { apiList, apiCreate, apiUpdate, apiRemove } from './client.js'

function normalize(m) {
  return {
    id: m.id,
    nom: m.nom,
    role: m.role,
    roleColor: m.role_color,
    permissions: m.permissions || [],
    charge: m.charge,
    assignees: m.assignees,
    accountEmail: m.user?.email ?? null,
    hasAccount: !!m.user_id,
  }
}

export async function getTeamMembers() {
  const rows = await apiList('team-members')
  return rows.map(normalize)
}

export async function createTeamMember(data) {
  return normalize(await apiCreate('team-members', data))
}

export async function updateTeamMember(id, data) {
  return normalize(await apiUpdate('team-members', id, data))
}

export function deleteTeamMember(id) {
  return apiRemove('team-members', id)
}
