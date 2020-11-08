import React, { ReactElement } from 'react'
import { useListPostsQuery } from '../../__generated__/graphql'

export default function Feed(): ReactElement {
  const { data } = useListPostsQuery()
  return (
    <ul className="bg-white">
      {data?.listPosts?.items?.map((post, index) => (
        <li key={index} className="pt-2 bg-gray-200 ">
          <a
            href="#"
            className="block w-full h-full bg-white shadow border-b border-gray-400 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
          >
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm leading-5 font-medium text-indigo-600 truncate">
                    {post?.title}
                  </div>
                  <div className="flex">
                    <div className="flex items-center text-sm leading-5 text-gray-500">
                      <span>{post?.description}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
