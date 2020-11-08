import React, { ReactElement, ReactNode } from 'react'
import Nav from '../Nav'

type Props = {
  children?: ReactNode
}

function FeedLayout({ children }: Props): ReactElement {
  return (
    <div className="bg-gray-200">
      <Nav />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}

export default FeedLayout
