import useSidebarWidth from '@/store/sidebarWidth'
import UserProfile from './UserProfile'

export default function DashboardNavbar({ link }) {
  let heading = link.replace('/', '')
  const { width } = useSidebarWidth()
  return (
    <>
      <div className={`flex flex-row justify-between
       items-center px-2 py-1 bg-zinc-900
        shadow-2xl shadow-zinc-700`}
        style={{
          width: width ? 'calc(100% - var(--sidebar-width))' : '100%'
        }}>
        <h3 className='capitalize font-inter font-semibold'>{heading} Dashboard</h3>
        {/* <UserProfile /> */}
        <UserProfile />
      </div>
    </>
  )
}
