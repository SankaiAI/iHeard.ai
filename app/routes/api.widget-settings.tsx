import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import db from "../db.server";

// Default settings (same as in settings page)
const DEFAULT_SETTINGS = {
  enabled: true,
  position: "bottom-right",
  buttonText: "Ask AI Assistant",
  chatTitle: "AI Sales Assistant",
  welcomeMessage: "Hello! I'm your AI sales assistant. I can help you find products, answer questions about pricing, shipping, and provide personalized recommendations. How can I assist you today?",
  inputPlaceholder: "Ask me anything about our products...",
  primaryColor: "#e620e6",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Extract shop domain from request headers
    const url = new URL(request.url);
    const shopDomain = url.searchParams.get("shop");
    
    if (!shopDomain) {
      // Return default settings if no shop specified
      const response = json({ settings: DEFAULT_SETTINGS });
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return response;
    }
    
    // Fetch settings from database
    let settings = await db.widgetSettings.findUnique({
      where: { shop: shopDomain }
    });
    
    if (!settings) {
      // Create default settings if none exist
      settings = await db.widgetSettings.create({
        data: {
          shop: shopDomain,
          ...DEFAULT_SETTINGS
        }
      });
    }
    
    const response = json({ settings });
    
    // Add CORS headers to allow the storefront to access this endpoint
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return response;
  } catch (error) {
    console.error("Error fetching widget settings:", error);
    
    // Return default settings on error
    const response = json({ settings: DEFAULT_SETTINGS });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return response;
  }
}; 