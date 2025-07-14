# 🔧 Setup Guide

This guide will help you set up the project after cloning from GitHub.

## 🔐 Required Configuration Files

The following files contain sensitive information and are not included in the repository. You need to create them manually.

### 1. Environment Variables (`.env`)

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
# Get this from your Shopify Partner Dashboard > Apps > [Your App] > App setup
# This is the same as your "Client ID" from the Shopify Partner Dashboard
SHOPIFY_API_KEY=your_shopify_api_key_here

# Generate a unique UUID for your widget (you can use: https://www.uuidgenerator.net/)
# This identifies your specific widget instance and can be any unique UUID
SHOPIFY_SALES_ASSISTANT_WIDGET_ID=your_widget_id_here

# Optional: N8N webhook URL for AI processing
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

#### 📝 How to Get These Values:

**SHOPIFY_API_KEY**:
1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Navigate to "Apps" → Select your app
3. Go to "App setup" tab
4. Copy the **Client ID** value (this is your API key)

**SHOPIFY_SALES_ASSISTANT_WIDGET_ID**:
1. Visit [UUID Generator](https://www.uuidgenerator.net/)
2. Click "Generate" to create a new UUID v4
3. Copy the generated UUID (e.g., `bc053588-7383-478e-b5d1-e95f343d267e`)
4. This uniquely identifies your widget instance

**N8N_WEBHOOK_URL** (Optional):
1. Set up your N8N workflow (see `N8N_SETUP.md` for details)
2. Copy the webhook URL from your N8N workflow
3. Format: `https://your-n8n-instance.com/webhook/your-webhook-id`

### 2. Shopify App Configuration (`shopify.app.toml`)

Create the Shopify app configuration file:

```bash
# Copy the example file
cp shopify.app.example.toml shopify.app.toml
```

Then edit `shopify.app.toml` with your actual values:

```toml
# Get this from your Shopify Partner Dashboard
client_id = "your_shopify_app_client_id_here"

# This will be automatically updated when you run 'shopify app dev'
application_url = "https://your-tunnel-url.trycloudflare.com"

# Update redirect URLs to match your tunnel URL
[auth]
redirect_urls = [
  "https://your-tunnel-url.trycloudflare.com/auth/callback",
  "https://your-tunnel-url.trycloudflare.com/auth/shopify/callback",
  "https://your-tunnel-url.trycloudflare.com/api/auth/callback"
]
```

## 🏪 Shopify Partner Setup

### 1. Create a Shopify Partner Account

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Sign up for a Partner account
3. Complete the verification process

### 2. Create a New App

1. In Partner Dashboard, click "Apps" → "Create app"
2. Choose "Create app manually"
3. Fill in the app details:
   - **App name**: `iheard.ai` (or your preferred name)
   - **App URL**: Leave blank for now (will be auto-filled)
   - **Allowed redirection URL(s)**: Leave blank for now

### 3. Get Your API Credentials

1. After creating the app, go to "App setup"
2. Copy the **Client ID** (this is your `SHOPIFY_API_KEY` for the `.env` file)
3. Note down the **Client secret** (you may need this later)
4. The Client ID is also used as `client_id` in your `shopify.app.toml` file

### 4. Create a Development Store

1. In Partner Dashboard, go to "Stores" → "Add store"
2. Choose "Development store"
3. Fill in store details and create the store
4. This store will be used for testing your app

## 🚀 First Run

After setting up the configuration files:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Set up database**:
   ```bash
   npx prisma migrate dev
   ```

4. **Start development server**:
   ```bash
   shopify app dev
   ```

5. **Follow the CLI prompts**:
   - Select your Partner organization
   - Choose your app
   - Select your development store
   - The CLI will automatically update `shopify.app.toml` with the tunnel URL

## 🎨 Installing the Widget

After the app is running:

1. **Install the app** in your development store (follow the CLI link)
2. **Go to theme customizer**: Online Store → Themes → Customize
3. **Add the widget**: Look for "AI Sales Assistant" in the app embeds section
4. **Configure the widget**: Use the admin panel at `/app/settings` to customize

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined (reading 'findUnique')"**
   - Run `npx prisma generate` and `npx prisma migrate dev`

2. **"Extension draft update failed"**
   - Make sure you're in the correct directory
   - Restart the development server

3. **"Server IP address could not be found"**
   - The tunnel URL has changed, restart `shopify app dev`

4. **Widget not appearing on storefront**
   - Check if the app embed is enabled in theme customizer
   - Verify the widget is enabled in admin settings

### Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Open an issue on GitHub if you encounter problems
- Refer to [Shopify's documentation](https://shopify.dev/docs/apps) for app development help

## 🔒 Security Notes

- **Never commit** `.env` or `shopify.app.toml` files to version control
- **Keep your API keys secure** and don't share them publicly
- **Use environment variables** for all sensitive configuration
- **Regularly rotate** your API keys and secrets 