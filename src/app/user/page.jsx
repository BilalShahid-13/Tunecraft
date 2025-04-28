import { useUser } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const user1 = await currentUser()
  // const { user } = useUser()
  console.log('current user', user1)

  if (!user) return <div>Not signed in</div>

  return <div>Hello {user?.firstName}</div>
}