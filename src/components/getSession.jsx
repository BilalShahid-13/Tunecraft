import React, { useEffect, useState } from 'react'
import { getSession as getsession } from 'next-auth/react'

export default function getSession() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getsession()
      setSession(sessionData)
    }
    fetchSession()
  }, [])


  if (!session) return
  <>
    <div className='fixed w-full h-screen justify-center items-center'>
      <h3 className='text-[#ff7e6e] uppercase font-inter'>Tunecraft</h3>
    </div>
  </>

  if (!session.user) return
  <>
    <div className='fixed w-full h-screen justify-center items-center'>
      <h3 className='text-[#ff7e6e] capitalize font-inter'>User not authenticated</h3>
    </div>
  </>

  return (
    <>

    </>
  )
}
