<div align="center">
  <img src="public/High-Resolution-Color-Logo-Blue-on-Transparent-Background.png" alt="iHeard.ai Logo" width="300">
</div>
# 🤖 iHeard.ai - AI Sales Assistant for Shopify

An intelligent AI-powered sales assistant widget for Shopify stores that helps customers find products, answer questions, and provide personalized recommendations.

## 📋 Features

### 🎯 **Core AI Features**
- **Smart Product Recommendations** - AI-powered product suggestions with enhanced product cards and visual previews
- **Real-time Chat Interface** - Floating widget with typewriter animation, customizable themes, and mobile optimization
- **Voice Call Integration** - Click-to-call functionality with voice status indicators and manual call control
- **Enhanced Voice Detection** - Advanced speech recognition with background noise calibration and pattern validation

### 🎨 **Visual & UX Features**
- **Dynamic Wave Animation** - Real-time voice visualization that responds only to detected speech
- **Customizable Themes** - Default semi-transparent appearance or fully customizable colors, gradients, and glass effects
- **Responsive Design** - Mobile-first with fullscreen mobile experience and desktop floating widget
- **Interactive Elements** - Fireworks animations, smooth transitions, and professional loading states
- **Six Position Options** - Place widget anywhere: corners, center sides, fully customizable

### 🔧 **Technical Features**
- **Real-time Updates** - Settings changes reflect on storefront within 5 seconds
- **Background Noise Calibration** - 2-second automatic calibration for optimal voice detection
- **Speech Pattern Recognition** - Filters out keyboard typing, door slams, and background noise
- **Microphone Integration** - Advanced Web Audio API with echo cancellation and noise suppression
- **Fallback Protection** - Graceful degradation when microphone access is denied

### 🔌 **Integration & Configuration**
- **Dual AI Workflows** - Choose between developer's default AI or custom N8N webhook integration
- **App Proxy Architecture** - Seamless settings synchronization through Shopify's app proxy system
- **Database Persistence** - SQLite for development, PostgreSQL ready for production
- **OAuth Security** - Full Shopify authentication with session management

## 🏗️ Architecture

- **Frontend**: Remix with TypeScript and Shopify Polaris UI
- **Backend**: Node.js with Prisma ORM and SQLite database
- **Theme Extension**: Liquid template with vanilla JavaScript
- **AI Integration**: N8N webhooks with fallback processing
- **Authentication**: Shopify OAuth with session management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Shopify Partner account
- Shopify CLI 3.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SankaiAI/iheard.ai.git
   cd iheard.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Shopify app credentials
   ```
   
   **Required values for `.env`:**
   - `SHOPIFY_API_KEY`: Get from Shopify Partner Dashboard > Apps > [Your App] > App setup (Client ID)
   - `SHOPIFY_SALES_ASSISTANT_WIDGET_ID`: Generate a UUID at [uuidgenerator.net](https://www.uuidgenerator.net/)
   
   **Optional N8N Integration:**
   - `N8N_WEBHOOK_URL`: Your N8N webhook URL for AI processing
   - `N8N_API_KEY`: N8N API key (if authentication required)
   
   See `SETUP.md` for detailed instructions on obtaining these values.
   See `N8N_SETUP.md` for complete N8N workflow setup.

4. **Configure Shopify app**
   ```bash
   cp shopify.app.example.toml shopify.app.toml
   # Edit shopify.app.toml with your app details
   ```

5. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   shopify app dev
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
SHOPIFY_API_KEY=your_shopify_api_key_here
SHOPIFY_SALES_ASSISTANT_WIDGET_ID=your_widget_id_here
```

### Shopify App Configuration

Update `shopify.app.toml` with your app details:

```toml
client_id = "your_shopify_app_client_id"
name = "ihear.ai"
application_url = "https://your-tunnel-url.trycloudflare.com"
```

## 📁 Project Structure

```
ihear-ai/
├── app/                          # Remix application
│   ├── routes/                   # App routes
│   │   ├── app.settings.tsx      # Admin settings page
│   │   ├── api.widget-settings.tsx # Widget settings API
│   │   └── apps.sales-assistant-api.tsx # AI chat API
│   ├── db.server.ts              # Database connection
│   └── shopify.server.ts         # Shopify authentication
├── extensions/                   # Shopify theme extensions
│   └── sales-assistant-widget/   # AI widget extension
│       ├── blocks/               # Theme blocks
│       │   └── ai_sales_assistant.liquid # Main widget
│       ├── assets/               # Static assets
│       ├── locales/              # Translations
│       └── snippets/             # Reusable snippets
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
└── services/                     # External services
    └── n8n.service.ts            # N8N integration
```

## 🎛️ Admin Panel Features

### Widget Configuration
- **Enable/Disable** - Toggle widget on/off across the store
- **Position Settings** - 6 positioning options (corners and center sides)
- **Customization** - Button text, chat title, welcome message, placeholder text
- **Color Picker** - Fully functional color customization
- **Live Preview** - See changes in real-time

### AI Workflow Configuration
- **Default Workflow** - Use the developer's pre-configured AI assistant with product recommendations
- **Custom N8N Workflow** - Configure your own N8N webhook URL for custom AI processing
- **Dynamic Switching** - Easily switch between default and custom workflows
- **Fallback Protection** - Automatic fallback to local processing if webhooks fail

### Settings Auto-Sync
- Changes in admin panel update the storefront within 5 seconds
- Database persistence ensures settings survive server restarts
- Fallback to default settings if API is unavailable

## 🎙️ Voice Call Features

### Voice Status Indicators
- **"Connecting"** with orange pulsing indicator when call initiates
- **"In Call"** status with green indicator during active calls
- **Manual call control** - User must click "End" to terminate calls (no auto-reset)

### Dynamic Wave Animation
- **Speech-Only Animation** - Wave bars remain static until actual speech is detected
- **Center-Focused Design** - Bars animate from edges toward center for natural wave effect
- **Frequency-Based Heights** - Each bar responds to different speech frequency ranges (300Hz-3400Hz)
- **Enhanced Detection** - Distinguishes human speech from background noise, keyboard typing, and sudden sounds

### Voice Detection Technology
- **Background Noise Calibration** - 2-second automatic measurement on call start
- **Pattern Recognition** - Requires 3 out of 4 samples to confirm speech (reduces false positives)
- **Advanced Audio Processing** - Uses Web Audio API with echo cancellation and noise suppression
- **Dynamic Thresholds** - Automatically adjusts sensitivity based on environment

### Voice Status Messages
- **"Calibrating..."** - During initial 2-second noise measurement
- **"I'm hearing"** - Ready state, waiting for user to speak
- **"I heard you"** - Active speech detected and processing

### Input Transformation
- **Smooth Transitions** - Input box fades out with scale animation (300ms)
- **Wave Appearance** - Wave animation fades in with professional scaling effect
- **Seamless Restoration** - Returns to input box when call ends
- **Mobile Optimization** - Fullscreen experience on mobile devices

## 🔧 Development

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name description

# Reset database (development only)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Local Development Workflow

⚠️ **Important for Local Development**: Every time you restart `shopify app dev`, you must update the **App Proxy URL** in your Shopify Partner Dashboard because the tunnel URL changes.

**Quick Steps:**
1. Check your new tunnel URL in `shopify.app.toml` → `application_url`
2. Update the proxy URL in Partner Dashboard → Apps → [Your App] → App setup → App proxy
3. Set proxy URL to: `https://NEW-TUNNEL-URL.trycloudflare.com/api/widget-settings`

**Why this matters:**
- The widget needs to fetch settings from your app's API
- Tunnel URLs change on each restart for security
- Without updating the proxy URL, you'll get "Failed to fetch" errors

See `SETUP.md` for detailed instructions on app proxy configuration.

### Theme Extension Development

The widget is built as a Shopify theme extension block that can be added to any theme template. It automatically:

- Fetches configuration from the admin panel
- Applies custom styling and positioning
- Handles real-time chat interactions
- Integrates with the AI backend

### API Endpoints

- `GET /api/widget-settings` - Fetch widget configuration
- `POST /apps/sales-assistant-api` - Process AI chat messages

## 🤖 AI Integration

### Two Workflow Options

**1. Default Developer Workflow**
- Pre-configured AI assistant with product recommendations
- Works out-of-the-box with no additional setup
- Integrated with your store's product catalog
- Handles common customer queries automatically

**2. Custom N8N Workflow**
- Configure your own N8N webhook URL through the admin panel
- Advanced AI processing with full customization
- Integrate with external AI services (OpenAI, Claude, etc.)
- Custom business logic and integrations

### Configuration

**Admin Panel Configuration:**
1. Go to **App Settings** → **AI Workflow Configuration**
2. Choose between "Use Developer's Default Workflow" or "Use My Custom N8N Workflow"
3. If using custom: Enter your N8N webhook URL (must be HTTPS)
4. Save settings - changes take effect immediately

**Environment Configuration (Optional):**
- Set `N8N_WEBHOOK_URL` in `.env` for a global default
- Individual stores can override this with their own webhook URLs
- Supports both shared and per-store N8N configurations

### Fallback Processing

The app provides robust fallback protection:
- If custom webhook fails → Falls back to local processing
- If network issues occur → Provides helpful default responses
- Ensures chat widget always works regardless of external dependencies

### Voice Call API Configuration

**Voice Service Integration:**
The voice call feature is designed to integrate with external voice processing services. Currently, placeholder URLs are used in the code that need to be replaced with your actual voice service endpoints:

```javascript
// Replace these placeholder URLs in ai_sales_assistant.liquid:
const voiceServiceUrl = 'YOUR_VOICE_SERVICE_URL/api/voice/status';  // Health check
const voiceServiceUrl = 'YOUR_VOICE_SERVICE_URL/api/voice/start';   // Start call
const voiceServiceUrl = 'YOUR_VOICE_SERVICE_URL/api/voice/end';     // End call
```

**Required Voice API Endpoints:**
- `GET /api/voice/status` - Check if voice service is available
- `POST /api/voice/start` - Initiate voice call session
- `POST /api/voice/end` - Terminate voice call session

**Voice Service Expected Response Format:**
```json
// Status endpoint
{
  "status": "available|busy|unavailable"
}

// Start endpoint  
{
  "success": true,
  "sessionId": "voice_session_123",
  "message": "Voice call started"
}
```

**Current Implementation:**
- Voice detection and wave animation work independently of external APIs
- Call button triggers "Agent is busy" alert if voice service is unavailable
- Manual call control allows users to end calls regardless of API response
- Graceful fallback ensures widget functionality even without voice service integration

## 🚀 Deployment

### Development Deployment

The app runs in development mode with Shopify CLI:

```bash
shopify app dev
```

### Production Deployment

This app requires **TWO separate deployments** for production:

#### 1. Deploy Backend to Vercel

**Step 1: Prepare for Vercel**
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Build the project
npm run build
```

**Step 2: Configure Database**
- Set up a production database (PostgreSQL recommended)
- Update your production `DATABASE_URL` in environment variables

**Step 3: Deploy to Vercel**
```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard:
# - SHOPIFY_API_KEY
# - SHOPIFY_SALES_ASSISTANT_WIDGET_ID  
# - DATABASE_URL
# - N8N_WEBHOOK_URL (optional)
```

**Step 4: Run Database Migrations**
```bash
# Run on Vercel deployment
npx prisma migrate deploy
npx prisma generate
```

#### 2. Configure Shopify App

**Step 1: Update shopify.app.toml for Production**
```toml
client_id = "your_shopify_app_client_id"
name = "ihear.ai" 
application_url = "https://your-app.vercel.app"  # Your Vercel domain

[app_proxy]
url = "https://your-app.vercel.app/api/widget-settings"
subpath = "widget-settings"
prefix = "apps"

[auth]
redirect_urls = [
  "https://your-app.vercel.app/auth/callback",
  "https://your-app.vercel.app/auth/shopify/callback", 
  "https://your-app.vercel.app/api/auth/callback"
]
```

**Step 2: Deploy to Shopify**
```bash
# Deploy theme extension and app configuration
shopify app deploy --force
```

**Step 3: Verify Configuration**
- Check Shopify Partners Dashboard → Your App → App setup
- Verify **App URL** points to your Vercel domain  
- Verify **App proxy** is configured:
  - **Subpath**: `widget-settings`
  - **URL**: `https://your-app.vercel.app/api/widget-settings`

### ⚠️ Critical Configuration Notes

**App Proxy is Required**: The widget fetches settings via Shopify's app proxy. Without proper configuration, you'll get 404 errors.

**URL Consistency**: All URLs in `shopify.app.toml` must match your production Vercel domain exactly.

**Two-Step Process**: 
1. **Vercel** handles your app backend (API routes, database, admin UI)
2. **Shopify** handles theme extension (widget JavaScript/CSS served to storefronts)

### Deployment Flow Diagram

```
┌─────────────────────┐    Widget Settings     ┌──────────────────────┐
│   Shopify Storefront │ ──── App Proxy ────▶  │   Your Vercel App    │
│                     │                        │                      │
│  Widget JavaScript  │                        │  /api/widget-settings │
│ (from Shopify CDN)  │                        │  Database operations │
└─────────────────────┘                        └──────────────────────┘
```

## 🔧 Troubleshooting Deployment

### Widget Shows "404 Not Found" Error

**Problem**: Widget can't load settings from `/api/widget-settings`

**Solutions**:
1. **Check App Proxy Configuration** in Shopify Partners Dashboard:
   - Go to Apps → [Your App] → App setup → App proxy
   - Verify subpath: `widget-settings`
   - Verify URL: `https://your-app.vercel.app/api/widget-settings`

2. **Verify shopify.app.toml** has correct app proxy config:
   ```toml
   [app_proxy]
   url = "https://your-app.vercel.app/api/widget-settings"
   subpath = "widget-settings"
   prefix = "apps"
   ```

3. **Re-deploy to Shopify** after making changes:
   ```bash
   shopify app deploy --force
   ```

### App URL Shows Development Tunnel Instead of Vercel

**Problem**: After `shopify app deploy`, the app URL changed back to a tunnel URL

**Solution**: 
1. **Update shopify.app.toml** with production URLs:
   ```toml
   application_url = "https://your-app.vercel.app"
   
   [auth]
   redirect_urls = [
     "https://your-app.vercel.app/auth/callback",
     "https://your-app.vercel.app/auth/shopify/callback", 
     "https://your-app.vercel.app/api/auth/callback"
   ]
   ```

2. **Re-deploy immediately**:
   ```bash
   shopify app deploy --force
   ```

### Database Connection Issues on Vercel

**Problem**: Database queries fail in production

**Solutions**:
1. **Check DATABASE_URL** environment variable in Vercel dashboard
2. **Run migrations** on production database:
   ```bash
   npx prisma migrate deploy
   ```
3. **Generate Prisma client** for production:
   ```bash
   npx prisma generate
   ```

### Widget Not Loading on Storefront

**Problem**: Widget button doesn't appear on store pages

**Solutions**:
1. **Add the widget block** to your theme:
   - Go to Online Store → Themes → Customize
   - Add "AI Sales Assistant" block to desired pages
   - Save theme

2. **Check if widget is enabled** in app settings:
   - Open your app from Shopify admin
   - Verify "Enable Widget" is checked
   - Save settings

### CORS Errors in Browser Console

**Problem**: Cross-origin request blocked errors

**Solution**: The API already includes CORS headers, but verify your Vercel deployment has the correct API routes:
- `/api/widget-settings` should be accessible
- Check Vercel function logs for any errors

### Environment Variables Missing

**Problem**: App crashes or functions incorrectly

**Solution**: Verify all required environment variables are set in Vercel:
```bash
# Required variables:
SHOPIFY_API_KEY=your_api_key
SHOPIFY_SALES_ASSISTANT_WIDGET_ID=your_widget_id
DATABASE_URL=your_database_url

# Optional:
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### Quick Debugging Commands

```bash
# Check current app configuration
cat shopify.app.toml

# Test API endpoint locally
curl https://your-app.vercel.app/api/widget-settings

# Check Vercel deployment logs
vercel logs

# Verify database connection
npx prisma studio
```

## 🔒 Security Considerations

- **API Keys**: Never commit `.env` or `shopify.app.toml` files
- **Database**: SQLite is suitable for development; use PostgreSQL for production
- **CORS**: Widget API includes proper CORS headers for cross-origin requests
- **Authentication**: All admin routes require Shopify OAuth authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Shopify App Development](https://shopify.dev/docs/apps)
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🙏 Acknowledgments

- Built with [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- UI components from [Shopify Polaris](https://polaris.shopify.com/)
- Database ORM by [Prisma](https://www.prisma.io/)
- Web framework by [Remix](https://remix.run/)

---

**Made with ❤️ for the Shopify ecosystem**
