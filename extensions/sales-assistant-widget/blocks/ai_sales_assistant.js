// AI Sales Assistant Widget JavaScript - App Embed Version
(function() {
  let chatOpen = false;
  let conversationHistory = [];
  let widgetSettings = null;
  
  // Default settings (will be updated from app metafields)
  let appEmbedSettings = {
    enabled: true,
    position: "bottom-right",
    buttonText: "Ask AI Assistant",
    chatTitle: "AI Sales Assistant",
    welcomeMessage: "Hello! I'm your AI sales assistant. I can help you find products, answer questions about pricing, shipping, and provide personalized recommendations. How can I assist you today?",
    inputPlaceholder: "Ask me anything about our products...",
    primaryColor: "#ee5cee"
  };

  // Initialize the widget
  function initWidget() {
    console.log('🚀 Initializing AI Sales Assistant Widget (App Embed)');
    
    // Check if container exists
    const container = document.getElementById('ai-sales-assistant-container');
    if (!container) {
      console.error('AI Assistant container not found');
      return;
    }

    // Get settings from data attributes if available
    const settingsData = container.dataset.settings;
    if (settingsData) {
      try {
        const parsedSettings = JSON.parse(settingsData);
        appEmbedSettings = { ...appEmbedSettings, ...parsedSettings };
      } catch (e) {
        console.warn('Could not parse widget settings:', e);
      }
    }

    // Exit if disabled
    if (!appEmbedSettings.enabled) {
      console.log('AI Assistant disabled via app embed settings');
      return;
    }

    console.log('📐 Settings:', appEmbedSettings);
    
    createWidgetHTML();
    addEventListeners();
    updateWidgetAppearance();
    
    // Fetch and merge with database settings
    fetchWidgetSettings();
  }

  // Fetch widget settings from database via app proxy
  function fetchWidgetSettings() {
    const apiUrl = '/apps/api';
    const shopDomain = getShopDomain();
    
    fetch(`${apiUrl}?endpoint=widget-settings&shop=${shopDomain}`)
      .then(response => response.json())
      .then(data => {
        if (data.settings) {
          // Merge app embed settings with database settings
          widgetSettings = { ...appEmbedSettings, ...data.settings };
          console.log('🔄 Merged settings:', widgetSettings);
          updateWidgetAppearance();
        }
      })
      .catch(error => {
        console.log('⚠️ Could not fetch database settings, using app embed settings:', error);
        widgetSettings = appEmbedSettings;
        updateWidgetAppearance();
      });
  }

  // Get shop domain from various sources
  function getShopDomain() {
    // Try to get from window.Shopify
    if (window.Shopify && window.Shopify.shop) {
      return window.Shopify.shop;
    }
    
    // Try to get from hostname
    const hostname = window.location.hostname;
    if (hostname.includes('.myshopify.com')) {
      return hostname;
    }
    
    // Try to extract from URL
    const match = window.location.hostname.match(/([^.]+)\.myshopify\.com/);
    if (match) {
      return match[0];
    }
    
    console.warn('Could not determine shop domain, using hostname:', hostname);
    return hostname;
  }

  // Create widget HTML
  function createWidgetHTML() {
    const container = document.getElementById('ai-sales-assistant-container');
    if (!container) {
      console.error('AI Assistant container not found');
      return;
    }

    container.innerHTML = `
      <!-- Chat Button -->
      <div id="ai-chat-button" class="ai-chat-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span id="ai-button-text">${appEmbedSettings.buttonText}</span>
      </div>

      <!-- Chat Window -->
      <div id="ai-chat-window" class="ai-chat-window">
        <div class="ai-chat-header">
          <h3 id="ai-chat-title">${appEmbedSettings.chatTitle}</h3>
          <button id="ai-chat-close" class="ai-chat-close">×</button>
        </div>
        
        <div class="ai-chat-messages" id="ai-chat-messages">
          <div class="ai-message assistant-message">
            <div class="message-content" id="ai-welcome-message">${appEmbedSettings.welcomeMessage}</div>
          </div>
        </div>
        
        <div class="ai-chat-input-container">
          <input 
            type="text" 
            id="ai-chat-input" 
            placeholder="${appEmbedSettings.inputPlaceholder}"
            maxlength="500"
          />
          <button id="ai-chat-send" class="ai-chat-send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading indicator -->
      <div id="ai-loading" class="ai-loading" style="display: none;">
        <div class="ai-loading-spinner"></div>
      </div>
    `;
  }

  // Update widget appearance based on settings
  function updateWidgetAppearance() {
    if (!widgetSettings) return;

    const button = document.getElementById('ai-chat-button');
    const chatWindow = document.getElementById('ai-chat-window');
    const buttonText = document.getElementById('ai-button-text');
    const chatTitle = document.getElementById('ai-chat-title');
    const welcomeMessage = document.getElementById('ai-welcome-message');
    const chatInput = document.getElementById('ai-chat-input');

    if (button) {
      // Position the button
      button.className = `ai-chat-button ai-position-${widgetSettings.position}`;
      button.style.backgroundColor = widgetSettings.primaryColor;
    }

    if (chatWindow) {
      chatWindow.className = `ai-chat-window ai-position-${widgetSettings.position}`;
    }

    if (buttonText) buttonText.textContent = widgetSettings.buttonText;
    if (chatTitle) chatTitle.textContent = widgetSettings.chatTitle;
    if (welcomeMessage) welcomeMessage.textContent = widgetSettings.welcomeMessage;
    if (chatInput) chatInput.placeholder = widgetSettings.inputPlaceholder;

    // Update CSS custom properties for dynamic theming
    const style = document.createElement('style');
    style.textContent = `
      .ai-chat-button { background: ${widgetSettings.primaryColor} !important; }
      .ai-chat-header { background: ${widgetSettings.primaryColor} !important; }
      .user-message .message-content { background: ${widgetSettings.primaryColor} !important; }
      .ai-chat-input-container input:focus { border-color: ${widgetSettings.primaryColor} !important; }
      .ai-chat-send { background: ${widgetSettings.primaryColor} !important; }
      .ai-loading-spinner { border-top-color: ${widgetSettings.primaryColor} !important; }
      .product-price { color: ${widgetSettings.primaryColor} !important; }
      .product-link { color: ${widgetSettings.primaryColor} !important; }
    `;
    document.head.appendChild(style);
  }

  // Add event listeners
  function addEventListeners() {
    // Chat button click
    document.addEventListener('click', function(e) {
      if (e.target.closest('#ai-chat-button')) {
        toggleChat();
      }
      
      if (e.target.id === 'ai-chat-close') {
        closeChat();
      }
      
      if (e.target.id === 'ai-chat-send' || e.target.closest('#ai-chat-send')) {
        sendMessage();
      }
    });

    // Enter key in input
    document.addEventListener('keypress', function(e) {
      if (e.target.id === 'ai-chat-input' && e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Toggle chat window
  function toggleChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    const button = document.getElementById('ai-chat-button');
    
    chatOpen = !chatOpen;
    
    if (chatOpen) {
      chatWindow.style.display = 'flex';
      button.style.display = 'none';
      document.getElementById('ai-chat-input').focus();
    } else {
      chatWindow.style.display = 'none';
      button.style.display = 'flex';
    }
  }

  // Close chat
  function closeChat() {
    chatOpen = false;
    document.getElementById('ai-chat-window').style.display = 'none';
    document.getElementById('ai-chat-button').style.display = 'flex';
  }

  // Show/hide loading indicator
  function showLoading(show) {
    const loading = document.getElementById('ai-loading');
    const sendButton = document.getElementById('ai-chat-send');
    
    if (loading) loading.style.display = show ? 'block' : 'none';
    if (sendButton) sendButton.disabled = show;
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('ai-chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    input.value = '';
    
    showLoading(true);
    
    // Send to AI service via Shopify app proxy
    const apiUrl = '/apps/api';
    const shopDomain = getShopDomain();
    
    console.log(`🚀 Making API call via Shopify app proxy: ${apiUrl}`);
    
    try {
      const response = await fetch(`${apiUrl}?endpoint=sales-assistant-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Shop-Domain': shopDomain,
        },
        body: JSON.stringify({
          userMessage: message,
          products: [],
          context: {
            page: window.location.pathname,
            productId: getProductIdFromPage(),
            conversationHistory: conversationHistory,
            shopDomain: shopDomain
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      
      console.log(`✅ Success! API call via app proxy worked`);
      const data = await response.json();
      
      showLoading(false);
      
      // Handle both old format (data.response) and new N8N format (data.message)
      let responseMessage = data.response || data.message;
      
      if (responseMessage) {
        // Add the main AI response
        addMessageToChat('assistant', responseMessage);
        
        // If there are product recommendations, display them
        if (data.recommendations && data.recommendations.length > 0) {
          displayProductRecommendations(data.recommendations);
        }
        
        // Update conversation history
        conversationHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: responseMessage }
        );
        
        // Keep only last 10 messages
        if (conversationHistory.length > 10) {
          conversationHistory = conversationHistory.slice(-10);
        }
      } else {
        addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      showLoading(false);
      console.error('AI Assistant Error:', error);
      addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
    }
  };
  
  // Add message to chat
  function addMessageToChat(sender, message) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Display product recommendations
  function displayProductRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) return;
    
    const messagesContainer = document.getElementById('ai-chat-messages');
    const recommendationsDiv = document.createElement('div');
    recommendationsDiv.className = 'ai-message assistant-message recommendations';
    
    let recommendationsHTML = '<div class="message-content"><strong>Recommended Products:</strong></div>';
    
    recommendations.forEach(product => {
      recommendationsHTML += `
        <div class="product-recommendation">
          <div class="product-info">
            <h4>${product.title}</h4>
            <p class="product-price">$${product.price}</p>
            <a href="/products/${product.handle}" class="product-link" target="_blank">View Product</a>
          </div>
        </div>
      `;
    });
    
    recommendationsDiv.innerHTML = recommendationsHTML;
    messagesContainer.appendChild(recommendationsDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Get product ID from current page (if on product page)
  function getProductIdFromPage() {
    // Try to get product ID from various places
    if (window.meta && window.meta.product && window.meta.product.id) {
      return window.meta.product.id;
    }
    
    // Check for product data in script tags
    const productJson = document.querySelector('script[type="application/ld+json"]');
    if (productJson) {
      try {
        const data = JSON.parse(productJson.textContent);
        if (data['@type'] === 'Product' && data.productID) {
          return data.productID;
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
    
    return null;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})(); 