import createPost from './createPost'
import deletePost from './deletePost'
import listPosts from './listPosts'
import CreatePostInput from './models/CreatePostInput'

type AppSyncEvent = {
  info: {
    fieldName: string
  }
  arguments: {
    id: string
    post: CreatePostInput
    limit: number
    nextToken: string
  }
}

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'createPost':
      return await createPost(event.arguments.post)
    case 'listPosts':
      return await listPosts(event.arguments.limit, event.arguments.nextToken)
    case 'deletePost':
      return await deletePost(event.arguments.id)
    default:
      return null
  }
}
