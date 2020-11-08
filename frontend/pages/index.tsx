import React, { ReactElement } from 'react'
import Head from 'next/head'
import Feed from '../components/Feed'
import CreatePostLink from '../components/CreatePostLink'
import FeedLayout from '../components/FeedLayout'

export default function IndexPage(): ReactElement {
  return (
    <div>
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div,
        div#__next > div > div {
          height: 100%;
        }
      `}</style>
      <Head>
        <title>App Sync Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FeedLayout>
        <div className="md:grid md:grid-cols-4 md:gap-6">
          <div className="md:col-span-1" />
          <div className="mt-5 md:mt-0 md:col-span-4 lg:col-span-2">
            <CreatePostLink />
            <Feed />
          </div>
        </div>
      </FeedLayout>
    </div>
  )
}
