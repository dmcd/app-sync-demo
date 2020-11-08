import React, { ReactElement } from 'react'
import CloseButton from '../CloseButton'
import { useForm, SubmitHandler } from 'react-hook-form'
import { CreatePostInput, Posts, Post } from '../../__generated__/graphql'
import { gql, useMutation } from '@apollo/client'

const CREATE_POST = gql`
  mutation createPost($post: CreatePostInput!) {
    createPost(post: $post) {
      id
      title
      createdAt
      updatedAt
    }
  }
`

type Props = {
  onClose: () => void
}

export default function CreatePostForm({ onClose }: Props): ReactElement {
  const { register, handleSubmit } = useForm<CreatePostInput>()

  const [createPost] = useMutation(CREATE_POST, {
    // there should be a way to avoid needing to do this manual cache update...
    update(cache, { data: { createPost } }) {
      cache.modify({
        fields: {
          listPosts(existingPosts: Posts) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                  title
                  createdAt
                  updatedAt
                }
              `,
            })
            return {
              items: [...(existingPosts.items as Array<Post>), newPostRef],
            }
          },
        },
      })
    },
  })
  const onSubmit: SubmitHandler<CreatePostInput> = async (post) => {
    post.userId = 'todo'
    await createPost({
      variables: {
        post: post,
      },
    })
    onClose()
  }

  return (
    <div className="pt-5 pb-6 px-5 space-y-6 transition transform origin-top-right bg-gray-100 shadow border-b border-gray-400">
      <div className="flex items-center justify-between">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
          <div className="flex justify-between">
            <div className="w-full">
              <div className="mt-1 rounded-md shadow-sm w-full">
                <input
                  className="appearance-none block w-full px-3 py-2 border border-gray-400 rounded-md placeholder-gray-600 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  name="title"
                  placeholder="title"
                  ref={register({ required: true })}
                />
              </div>
              <div className="mt-4 rounded-md shadow-sm w-full">
                <textarea
                  className="appearance-none block w-full px-3 py-2 min-h-10em border border-gray-400 rounded-md placeholder-gray-600 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  name="description"
                  placeholder="text (required)"
                  ref={register({ required: true })}
                />
              </div>
            </div>
            <div className="justify-between relative ml-16">
              <div className="-mr-2">
                <CloseButton onClick={onClose} />
              </div>
              <div className="absolute bottom-0 right-0">
                <span className="block rounded-md shadow-sm">
                  <button
                    type="submit"
                    className="flex float-right justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                  >
                    Post
                  </button>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
