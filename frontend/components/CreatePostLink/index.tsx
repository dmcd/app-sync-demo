import React, { useState, ReactElement } from 'react'
import CreatePostForm from '../CreatePostForm'

export default function CreatePostLink(): ReactElement {
  const [formOpen, setFormOpen] = useState(false)

  let formFields = null
  if (formOpen) {
    formFields = <CreatePostForm onClose={() => setFormOpen(false)} />
  }

  return (
    <div className="bg-white shadow sm:overflow-hidden cursor-pointer">
      <a
        href="#"
        className="block px-4 py-5 border-b border-gray-400 sm:px-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
        onClick={() => setFormOpen(!formOpen)}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-700">
          Create a post
        </h3>
      </a>
      {formFields}
    </div>
  )
}
