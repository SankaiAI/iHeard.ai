# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
shopify app dev    # Start development server with tunnel
```

### Database Management
```bash
npx prisma generate              # Generate Prisma client
npx prisma migrate dev           # Create and apply migrations
npx prisma migrate reset         # Reset database (dev only)
npx prisma studio               # View database in browser
```

### Build and Deployment
```bash
npm run build                   # Build the app
npm run lint                    # Run ESLint
shopify app deploy              # Deploy to production
```

### Testing
This project doesn't have specific test scripts configured. Check with the team for testing procedures.

## Architecture Overview

### Core Components
- **Frontend**: Remix app with TypeScript and Shopify Polaris UI components
- **Backend**: Node.js with Prisma ORM and SQLite database (dev) / PostgreSQL (prod)
- **Authentication**: Shopify OAuth with session storage via Prisma
- **Theme Extension**: Shopify theme block with vanilla JavaScript widget

### Key Files and Directories
- `app/routes/` - Remix routes including admin settings and APIs
- `app/shopify.server.ts` - Shopify app configuration and authentication
- `app/services/n8n.service.ts` - N8N integration service with fallback processing
- `extensions/sales-assistant-widget/` - Theme extension with AI chat widget
- `prisma/schema.prisma` - Database schema (Session and WidgetSettings models)

### Database Schema
- **Session**: Shopify OAuth session data
- **WidgetSettings**: Per-shop widget configuration (position, colors, text, etc.)

### API Endpoints
- `GET /api/widget-settings` - Fetch widget configuration for storefront
- `POST /api/widget-settings` - Process AI chat messages with N8N integration

**Important**: Single app proxy endpoint handles both GET (settings) and POST (chat) requests.

## Development Workflow

### Local Development Setup
1. Every restart of `shopify app dev` changes the tunnel URL
2. **Must update App Proxy URL** in Shopify Partner Dashboard after each restart
3. New proxy URL format: `https://NEW-TUNNEL-URL.trycloudflare.com/api/widget-settings`
4. Widget will fail to load settings without updated proxy URL

### N8N Integration
- Optional external AI processing via N8N webhooks
- Fallback processing provides basic responses when N8N unavailable
- Configure via `N8N_WEBHOOK_URL` and `N8N_API_KEY` environment variables

### Theme Extension
- Widget is implemented as a Shopify theme block
- Auto-fetches settings from admin panel
- Handles real-time chat with AI backend
- Customizable positioning (6 positions) and styling

## Environment Configuration

### Required Environment Variables
- `SHOPIFY_API_KEY` - From Shopify Partner Dashboard
- `SHOPIFY_SALES_ASSISTANT_WIDGET_ID` - Generated UUID

### Optional Environment Variables
- `N8N_WEBHOOK_URL` - N8N webhook endpoint
- `N8N_API_KEY` - N8N authentication key
- `SHOP_CUSTOM_DOMAIN` - Custom shop domain if needed

## Important Notes

### App Proxy Configuration
The widget depends on a single app proxy for both settings API and chat messages to N8N. The proxy URL must be updated in Shopify Partner Dashboard whenever the tunnel URL changes during development.

**App Proxy Setup:**
- **Subpath prefix**: `apps`
- **Subpath**: `widget-settings`
- **Proxy URL**: `https://tunnel-url.trycloudflare.com/api/widget-settings`
- **Handles**: Widget settings (GET) and N8N chat messages (POST)

### Database Migrations
Always run `npx prisma generate` after schema changes and `npx prisma migrate dev` to apply migrations.

### Widget Settings
Settings are stored per shop and sync automatically to the storefront within 5 seconds of changes in the admin panel.