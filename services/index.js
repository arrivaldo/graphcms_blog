
import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async () => {
  const query = gql`
    query MyQuery($after: String) {
      postsConnection(after: $after) {
        edges {
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            category {
              name
              slug
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  let posts = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const result = await request(graphqlAPI, query, { after });
    posts = [...posts, ...result.postsConnection.edges];
    hasNextPage = result.postsConnection.pageInfo.hasNextPage;
    after = result.postsConnection.pageInfo.endCursor;
  }

  return posts;
};

export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        author {
          bio
          name
          id
          photo {
            url
          }
        }
        createdAt
        slug
        title
        excerpt
        featuredImage {
          url
        }
        category {
          name
          slug
        }
        content {
          raw
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.post;
};

export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails {
      posts(orderBy: createdAt_ASC, last: 3) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query);

  return result.posts;
};

export const getSimilarPosts = async (categories, slug) => {

  
  const hasCategories = categories && categories.length > 0;

  const query = gql`
    query GetPostDetails($slug: String!) {
      posts(
        where: {
          slug_not: $slug
          ${hasCategories ? `AND: { categories_some: { slug_in: $categories } }` : ''}
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  const variables = { slug };
  if (hasCategories) {
    variables.categories = categories;
  }

  const result = await request(graphqlAPI, query, variables);

  return result.posts;
};


export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query);


  return result.categories;
}


export const submitComment = async (obj) => {
  const result = await fetch('/api/comments', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj),
  })
  return result.json();
}

export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug:String!) {
      comments(where: {post: {slug:$slug}}){
        name
        createdAt
        comment
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });

  return result.comments;
};


export const getPostsByCategory = async (slug) => {
  const query = gql`
    query GetPostsByCategory($slug: String!) {
      postsConnection(where: { category: { slug: $slug } }) {
        edges {
          node {
            title
            excerpt
            slug
          }
        }
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug });
  return result.postsConnection.edges.map((edge) => edge.node);
};


// export const getCategoryPost = async (slug) => {
//   const query = gql`
//   query GetCategoryPost($slug: String!) {
//     postsConnection(where: { category: { slug: $slug } }) {
//       edges {
//         cursor
//         node {
//                 category {
//               name
//               slug
//             }
//         }
//       }
//     }
//   }
// `;

//   const result = await request(graphqlAPI, query, { slug });
//   console.log('These are the results:', result.postsConnection.edges);

//   return result.postsConnection.edges;
// };



   export const getCategoryPost = async (slug) => {
     const query = gql`
       query GetCategoryPost($slug: String!) {
        postsConnection(where: {category: {slug: $slug}}) {
      edges {
        node {
           category {
                 name
                 slug
               }
        }
      }
    }
  }
       }
     `;

     try {
       const result = await request(graphqlAPI, query, { slug });
        console.log('GraphQL query result:', result);
       console.log(result.postsConnection.edges)
       return result.postsConnection.edges.map((edge) => edge.node);
     } catch (error) {
       console.error('ERROR ERROR ERROR ERROR:', error);

       return [];
     }
   };






// export const getCategoryPost = async (slug) => {  
//   const query = gql`
//     query GetCategoryPost($slug: String!) {
//       postsConnection(where: { categories_some: { slug: $slug } }) {
//         edges {
//           node {
//             author {
//               bio
//               name
//               id
//               photo {
//                 url
//               }
//             }
//             createdAt
//             slug
//             title
//             excerpt
//             featuredImage {
//               url
//             }
//             categories {
//               name
//               slug
//             }
//           }
//         }
//         pageInfo {
//           endCursor
//           hasNextPage
//         }
//       }
//     }
//   `;

//   const result = await request(graphqlAPI, query, { slug });  // Pass the slug value here
//   return result.postsConnection.edges;
// };