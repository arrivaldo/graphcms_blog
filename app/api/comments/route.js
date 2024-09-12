/** Any file inside the folder app/api/ is mapped to /api/ and 
 * will be treated as an API endopint instead of a page**/


import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const graphcmsToken = process.env.GRAPHCMS_TOKEN;

export async function POST(req, res) {
    const { name, email, slug, comment } = await req.json(); // Use req.json() instead of req.body in Next.js 13
  
    const graphQLClient = new GraphQLClient(graphqlAPI, {
      headers: {
        authorization: `Bearer ${graphcmsToken}`,
      },
    });
  
    const query = gql`
      mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
        createComment(data: { name: $name, email: $email, comment: $comment, post: { connect: { slug: $slug } } }) {
          id
        }
      }
    `;
  
    try {
      const result = await graphQLClient.request(query, { name, email, comment, slug });
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify(error), { status: 500 });
    }
  }
  