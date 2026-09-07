'use server'
import UsersContainer from '@/components/users/UsersContainer'
import { getPaginatedUsers } from '@/lib/actions'

export default async function UsersPage() {

  const getUsers = async () => {
    const users = await getPaginatedUsers()
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