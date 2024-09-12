import React from 'react';
import { notFound } from 'next/navigation'; // Import for handling 404 cases
import { getCategoryPost, getCategories } from '../../../services'; // Ensure the path is correct
import { PostCard, Categories } from '../../../components'; // Ensure the path is correct

const CategoryPost = async ({ params }) => {
  // Fetch data based on the category slug
  
  const posts = await getCategoryPost(params.slug);

  if (!posts || posts.length === 0) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};

// Generate static params for pre-rendering the pages
export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map(({ slug }) => ({
    slug
    
  }));
}

export default CategoryPost;
