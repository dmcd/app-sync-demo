import React, { useState, ReactElement } from 'react'
import ActiveLink from '../ActiveLink'
import HamburgerButton from '../HamburgerButton'
import MobileNav from '../MobileNav'

export default function Nav(): ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  let mobileNav = null
  if (mobileMenuOpen) {
    mobileNav = <MobileNav onClose={() => setMobileMenuOpen(false)} />
  }

  return (
    <div className="shadow relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="">
            <a href="#" className="flex">
              <img
                className="h-8 w-auto sm:h-10"
                src="https://tailwindui.com/img/logos/v1/workflow-mark-on-white.svg"
                alt="Workflow"
              />
            </a>
          </div>
          <div className="-mr-2 -my-2 md:hidden">
            <HamburgerButton onClick={() => setMobileMenuOpen(true)} />
          </div>
          <nav className="hidden md:flex space-x-10">
            <ActiveLink
              href="/"
              className="text-base leading-6 font-medium hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
            >
              Top
            </ActiveLink>
            <ActiveLink
              href="trending"
              className="text-base leading-6 font-medium hover:text-gray-900 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
            >
              Trending
            </ActiveLink>
          </nav>
          <div className="hidden md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
            <a
              href="#"
              className="whitespace-no-wrap text-base leading-6 font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
      {mobileNav}
    </div>
  )
}
