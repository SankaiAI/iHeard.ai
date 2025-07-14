import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { n8nService } from "../services/n8n.service";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate the request
    const { session } = await authenticate.public.appProxy(request);
    
    if (!session) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { admin } = await authenticate.admin(request);
    
    // Parse the request body
    const body = await request.json();
    const { message, context } = body;
    
    if (!message) {
      return json({ error: "Message is required" }, { status: 400 });
    }

    // Get products for context
    const response = await admin.graphql(`
      #graphql
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              featuredImage {
                url
              }
              variants(first: 1) {
                edges {
                  node {
                    price
                  }
                }
              }
            }
          }
        }
      }
    `, {
      variables: { first: 50 }
    });

    const responseData = (response as any).data;
    const products = responseData?.products?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      image: edge.node.featuredImage?.url,
      price: edge.node.variants.edges[0]?.node.price || "0.00"
    })) || [];

    // Enhanced context for better AI responses
    const enhancedContext = {
      ...context,
      shopDomain: session.shop,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    };

    // Process message through N8N service
    const n8nResponse = await n8nService.processUserMessage({
      userMessage: message,
      products,
      context: enhancedContext
    });
    
    return json({ 
      response: n8nResponse.message,
      recommendations: n8nResponse.recommendations || [],
      confidence: n8nResponse.confidence || 0.7,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Sales Assistant API Error:", error);
    return json({ 
      error: "Internal server error",
      message: "Sorry, I'm having trouble processing your request right now. Please try again later."
    }, { status: 500 });
  }
};

// Handle GET requests for health check
export const loader = async () => {
  return json({ 
    status: "healthy",
    service: "AI Sales Assistant API",
    timestamp: new Date().toISOString()
  });
}; 