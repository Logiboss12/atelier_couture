import { apiList } from './client.js'

export async function getTeamMembers() {
  const rows = await apiList('team-members')
  return rows.map((m) => ({
    id: m.id,
    nom: m.nom,
    role: m.role,
    roleColor: m.role_color,
    permissions: m.permissions || [],
    charge: m.charge,
    assignees: m.assignees,
  }))
}
