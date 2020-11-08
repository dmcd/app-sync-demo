import React, { ReactNode, ReactElement } from 'react'
import { useRouter } from 'next/router'

type Props = {
  href: string
  children?: ReactNode
  className?: string
}

function ActiveLink({ children, href, className }: Props): ReactElement {
  const router = useRouter()
  className += router.pathname === href ? ' text-gray-900' : ' text-gray-500'

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export default ActiveLink
