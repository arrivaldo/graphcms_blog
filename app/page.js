import Head from "next/head";
import Image from "next/image";
import { PostCard, Categories, PostWidget } from '../components';
import { getPosts } from '../services'; // Assuming getPosts is defined here
import { FeaturedPosts } from '../sections'

export default async function Home() {
  const posts = await getPosts(); // Fetching data directly inside the component
  console.log('Postsssssss',posts);

  return (
    <>
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FeaturedPosts />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
        {posts.map((post) => <PostCard post={post.node} key={post.id} />)}

        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
             <PostWidget />
             <Categories />
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
