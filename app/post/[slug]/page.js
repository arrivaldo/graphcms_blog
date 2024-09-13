import React from 'react';
import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader } from '../../../components';
import { getPostDetails, getPosts } from '../../../services';
import { notFound } from 'next/navigation'; // New Next.js method for handling 404s

const PostDetails = async ({ params }) => {
  const post = await getPostDetails(params.slug);

  // Handle case where post is not found
  if (!post) {
    notFound();
  }

  return (
    <div className='container mx-auto px-10 mb-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='col-span-1 lg:col-span-8'>
          <PostDetail post={post} />
          <Author author={post.author} />
          <CommentsForm slug={post.slug} />
          <Comments slug={post.slug} />
        </div>
        <div className='col-span-1 lg:col-span-4'>
          <div className='relative lg:sticky top-8'>
            <PostWidget 
              slug={post.slug} 
              categories={Array.isArray(post.categories) && post.categories.length > 0 ? post.categories.map((category) => category.slug) : []} 
            />
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};

// Static paths with fallback
export async function generateStaticParams() {
  const posts = await getPosts();
  console.log('asdasdasdasd',posts)

  return posts.map(({ node: { slug } }) => ({
    slug
  }));
}

// Add revalidate to enable fallback: true equivalent behavior in Next.js 13
export const revalidate = 45; // Revalidate every 60 seconds

export default PostDetails;
