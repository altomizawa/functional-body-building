'use server'
import UsersContainer from '@/components/users/UsersContainer'
import { getPaginatedUsers } from '@/lib/actions'
import { findUserByName } from '@/lib/actions'

export default async function UsersPage({ searchParams }) {
  const { q = "" } = await searchParams

  const getUsers = async () => {
    const users = !q || q === "" ? await getPaginatedUsers({ page: 1, limit: 100 }) : await findUserByName(q)
    if (users.success) {
      const sorted = users.data.sort((a, b) => a.name.localeCompare(b.name))
      return sorted
    }
    else {
      return []
    }
  }
  const users = await getUsers()
  return (
    <div>
      <UsersContainer users={users} />
    </div>
  )
}