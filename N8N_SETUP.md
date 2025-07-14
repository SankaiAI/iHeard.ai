# N8N Sales Assistant Setup Guide

This guide explains how to set up the N8N backend for the AI Sales Assistant in your Shopify app.

## Overview

The AI Sales Assistant uses N8N workflows to process customer messages and provide intelligent product recommendations. N8N acts as the backend processing engine that can integrate with various AI services, databases, and APIs.

## N8N Workflow Setup

### 1. Install N8N

You can run N8N in several ways:

**Option A: Using Docker**
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

**Option B: Using npm**
```bash
npm install n8n -g
n8n start
```

**Option C: Using N8N Cloud**
Sign up at https://n8n.cloud for a hosted solution.

### 2. Create the Sales Assistant Workflow

1. Open N8N in your browser (default: http://localhost:5678)
2. Create a new workflow
3. Add a Webhook trigger node:
   - Set HTTP Method to POST
   - Configure the webhook path (e.g., `/webhook/sales-assistant`)
   - Authentication: None (or configure as needed)

### 3. Workflow Structure

Your N8N workflow should include these nodes:

#### A. Webhook Trigger
- Receives POST requests from the Shopify app
- Expected payload:
  ```json
  {
    "userMessage": "I need a red dress for a wedding",
    "products": [...], // Array of store products
    "context": {
      "previousMessages": [...],
      "userPreferences": {...}
    }
  }
  ```

#### B. Message Processing Node
- Use a Function node or HTTP Request node to process the user message
- Options:
  - **OpenAI Integration**: Use HTTP Request node to call OpenAI API
  - **Local AI**: Use Function node with local AI processing
  - **Custom Logic**: Implement your own recommendation logic

#### C. Product Matching Node
- Filter and rank products based on user query
- Consider factors like:
  - Keywords in product titles/descriptions
  - Price range preferences
  - Category matching
  - Availability

#### D. Response Formatting Node
- Format the response for the Shopify app
- Expected response format:
  ```json
  {
    "message": "Here are some red dresses perfect for weddings:",
    "recommendations": [
      {
        "id": "gid://shopify/Product/123",
        "title": "Elegant Red Evening Dress",
        "handle": "red-evening-dress",
        "price": "129.99",
        "image": "https://...",
        "description": "Perfect for special occasions...",
        "relevanceScore": 95
      }
    ],
    "confidence": 0.9
  }
  ```

### 4. Sample N8N Workflow with OpenAI

Here's a basic workflow structure:

1. **Webhook Trigger**
   - Path: `/webhook/sales-assistant`
   - Method: POST

2. **Function Node - Extract Data**
   ```javascript
   const userMessage = $json.userMessage;
   const products = $json.products;
   
   return {
     json: {
       userMessage,
       products: products.slice(0, 20), // Limit for API call
       productContext: products.map(p => `${p.title}: ${p.description}`).join('\n')
     }
   };
   ```

3. **HTTP Request Node - OpenAI API**
   - URL: `https://api.openai.com/v1/chat/completions`
   - Method: POST
   - Headers: 
     - `Authorization: Bearer YOUR_OPENAI_API_KEY`
     - `Content-Type: application/json`
   - Body:
     ```json
     {
       "model": "gpt-4",
       "messages": [
         {
           "role": "system",
           "content": "You are a helpful sales assistant. Based on the user's message and available products, recommend the most suitable products and provide a helpful response."
         },
         {
           "role": "user",
           "content": "User message: {{$json.userMessage}}\n\nAvailable products:\n{{$json.productContext}}\n\nProvide product recommendations with explanations."
         }
       ],
       "max_tokens": 500
     }
     ```

4. **Function Node - Process AI Response**
   ```javascript
   const aiResponse = $json.choices[0].message.content;
   const products = $('Extract Data').item.json.products;
   
   // Simple product matching logic
   const userMessage = $('Extract Data').item.json.userMessage.toLowerCase();
   const recommendations = products.filter(product => {
     const title = product.title.toLowerCase();
     const description = (product.description || '').toLowerCase();
     
     // Basic keyword matching
     const keywords = userMessage.split(' ').filter(word => word.length > 3);
     return keywords.some(keyword => 
       title.includes(keyword) || description.includes(keyword)
     );
   }).slice(0, 3);
   
   return {
     json: {
       message: aiResponse,
       recommendations: recommendations,
       confidence: 0.8
     }
   };
   ```

### 5. Environment Variables

Set these environment variables in your Shopify app:

```bash
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/sales-assistant
N8N_API_KEY=your_n8n_api_key_if_needed
OPENAI_API_KEY=your_openai_api_key_if_using_openai
```

### 6. Testing the Integration

1. Start your N8N workflow
2. Run your Shopify app: `npm run dev`
3. Navigate to the AI Sales Assistant page
4. Send a test message like "I need a red dress"
5. Check N8N execution logs for debugging

### 7. Advanced Features

You can enhance the workflow with:

- **Memory**: Store conversation history in a database
- **User Preferences**: Track user preferences over time
- **Inventory Integration**: Check real-time inventory levels
- **Price Monitoring**: Track price changes and promotions
- **Analytics**: Log interactions for business insights
- **Multi-language Support**: Detect and respond in different languages

### 8. Security Considerations

- Use HTTPS for all webhook URLs
- Implement authentication for N8N webhooks
- Validate input data in N8N workflows
- Store API keys securely
- Rate limit webhook calls

### 9. Troubleshooting

**Common Issues:**
- Webhook not receiving data: Check URL and HTTP method
- AI responses not formatted correctly: Verify response parsing
- Products not matching: Improve keyword matching logic
- Slow responses: Optimize product filtering and AI calls

**Debug Steps:**
1. Check N8N execution logs
2. Verify webhook URL is accessible
3. Test with sample data in N8N
4. Check network connectivity
5. Validate JSON response format

## Support

For N8N-specific issues, check:
- [N8N Documentation](https://docs.n8n.io/)
- [N8N Community Forum](https://community.n8n.io/)
- [N8N GitHub Repository](https://github.com/n8n-io/n8n)

For Shopify integration issues, refer to:
- [Shopify App Development Docs](https://shopify.dev/docs/apps)
- [Shopify GraphQL API Reference](https://shopify.dev/docs/api/admin-graphql) 