import React from 'react'

export default async function page({ params }) {
  const { slug } = await params
  return (
    <>
      My Post: {slug}
    </>
  )
}
