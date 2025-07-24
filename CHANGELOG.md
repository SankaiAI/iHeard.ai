# iHeard.ai - AI Sales Assistant for Shopify

## [Unreleased] - iHeard.ai Features

### Added - Voice Call Integration
- **Voice call functionality** with click-to-call button in chat header
- **Dynamic wave animation** that responds only to detected speech (14 animated bars)
- **Enhanced voice detection** with background noise calibration and pattern recognition
- **Voice status indicators**: "Connecting" (orange pulse) → "In Call" (green) → Manual "End" control
- **Speech-only animation**: Wave bars remain static until actual human speech is detected
- **Background noise calibration**: 2-second automatic environment measurement on call start
- **Advanced speech filtering**: Distinguishes speech from keyboard typing, door slams, background noise
- **Voice status messages**: "Calibrating..." → "I'm hearing" → "I heard you"
- **Smooth input transitions**: Professional fade/scale animations between input box and wave visualization

### Added - Enhanced UI/UX Features  
- **Semi-transparent default appearance** with backdrop blur effects and glass styling
- **Gradient background support** with customizable colors and directions
- **Enhanced product recommendation cards** with hover effects, relevance badges, and improved spacing
- **Typewriter animation** for welcome messages with cursor effect
- **Fireworks celebration animation** triggered on product recommendations
- **Mobile fullscreen experience** with proper viewport handling and touch optimization
- **Professional loading states** with animated dots and context-aware messaging

### Added - Technical Enhancements
- **Advanced Web Audio API integration** with 512 FFT resolution for frequency analysis
- **Speech frequency analysis** targeting 300Hz-3400Hz human speech range
- **Pattern recognition system** requiring 3-out-of-4 samples to confirm speech (reduces false positives)
- **Dynamic threshold adjustment** based on environment background noise levels
- **Echo cancellation and noise suppression** through getUserMedia constraints
- **Graceful fallback protection** for microphone access denial scenarios
- **Real-time audio analysis** with 60fps wave animation updates
- **Enhanced mobile responsiveness** with fullscreen chat interface and improved scrolling

### Enhanced - Existing Features
- **Product recommendation display** with enhanced visual cards and better product information layout
- **Chat message spacing** with improved margins and scrolling behavior  
- **Settings synchronization** with 5-minute polling interval (reduced from 2 seconds for performance)
- **Mobile chat experience** with fullscreen interface and proper keyboard handling
- **Widget positioning system** with improved mobile adaptations
- **Color customization** expanded to support gradients and transparency effects

### Technical Implementation Details
- **Voice detection threshold**: `backgroundNoise + 20` with 40% speech energy ratio requirement
- **Speech validation**: Requires 2.5x background noise level and consistent pattern recognition
- **Wave animation**: Center-focused bars with frequency-mapped heights (8px-24px range)
- **Transition timing**: 300ms fade with 50ms delay for smooth visual effects
- **Microphone initialization**: Enhanced with `echoCancellation`, `noiseSuppression`, `autoGainControl`
- **Audio context**: 512 FFT size with 0.8 smoothing constant for optimal speech detection

---

# Shopify App Template Changelog

## 2025.07.07
- [#1103](https://github.com/Shopify/shopify-app-template-remix/pull/1086) Remove deprecated .npmrc config values

## 2025.06.12
- [#1075](https://github.com/Shopify/shopify-app-template-remix/pull/1075) Add Shopify MCP to [VSCode configs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_enable-mcp-support-in-vs-code)

## 2025.06.12
-[#1082](https://github.com/Shopify/shopify-app-template-remix/pull/1082) Remove local Shopify CLI from the template. Developers should use the Shopify CLI [installed globally](https://shopify.dev/docs/api/shopify-cli#installation).
## 2025.03.18
-[#998](https://github.com/Shopify/shopify-app-template-remix/pull/998) Update to Vite 6

## 2025.03.01
- [#982](https://github.com/Shopify/shopify-app-template-remix/pull/982) Add Shopify Dev Assistant extension to the VSCode extension recommendations

## 2025.01.31
- [#952](https://github.com/Shopify/shopify-app-template-remix/pull/952) Update to Shopify App API v2025-01

## 2025.01.23

- [#923](https://github.com/Shopify/shopify-app-template-remix/pull/923) Update `@shopify/shopify-app-session-storage-prisma` to v6.0.0

## 2025.01.8

- [#923](https://github.com/Shopify/shopify-app-template-remix/pull/923) Enable GraphQL autocomplete for Javascript

## 2024.12.19

- [#904](https://github.com/Shopify/shopify-app-template-remix/pull/904) bump `@shopify/app-bridge-react` to latest
-
## 2024.12.18

- [875](https://github.com/Shopify/shopify-app-template-remix/pull/875) Add Scopes Update Webhook
## 2024.12.05

- [#910](https://github.com/Shopify/shopify-app-template-remix/pull/910) Install `openssl` in Docker image to fix Prisma (see [#25817](https://github.com/prisma/prisma/issues/25817#issuecomment-2538544254))
- [#907](https://github.com/Shopify/shopify-app-template-remix/pull/907) Move `@remix-run/fs-routes` to `dependencies` to fix Docker image build
- [#899](https://github.com/Shopify/shopify-app-template-remix/pull/899) Disable v3_singleFetch flag
- [#898](https://github.com/Shopify/shopify-app-template-remix/pull/898) Enable the `removeRest` future flag so new apps aren't tempted to use the REST Admin API.

## 2024.12.04

- [#891](https://github.com/Shopify/shopify-app-template-remix/pull/891) Enable remix future flags.

## 2024.11.26
- [888](https://github.com/Shopify/shopify-app-template-remix/pull/888) Update restResources version to 2024-10

## 2024.11.06

- [881](https://github.com/Shopify/shopify-app-template-remix/pull/881) Update to the productCreate mutation to use the new ProductCreateInput type

## 2024.10.29

- [876](https://github.com/Shopify/shopify-app-template-remix/pull/876) Update shopify-app-remix to v3.4.0 and shopify-app-session-storage-prisma to v5.1.5

## 2024.10.02

- [863](https://github.com/Shopify/shopify-app-template-remix/pull/863) Update to Shopify App API v2024-10 and shopify-app-remix v3.3.2

## 2024.09.18

- [850](https://github.com/Shopify/shopify-app-template-remix/pull/850) Removed "~" import alias

## 2024.09.17

- [842](https://github.com/Shopify/shopify-app-template-remix/pull/842) Move webhook processing to individual routes

## 2024.08.19

Replaced deprecated `productVariantUpdate` with `productVariantsBulkUpdate`

## v2024.08.06

Allow `SHOP_REDACT` webhook to process without admin context

## v2024.07.16

Started tracking changes and releases using calver