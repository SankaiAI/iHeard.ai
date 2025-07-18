# 📝 PRD: Voice Integration for iHeard.ai Shopify App

## Objective
Enable seamless voice interaction in the Shopify app chat widget, leveraging the new Voice API.

## Scope
- Accept and forward voice messages to the Voice API
- Display transcriptions and play audio responses
- Add admin panel controls for voice features

## Success Metrics
- Voice messages processed end-to-end
- <200ms added latency for voice features
- 90%+ test coverage for new code

## Key Features
- `/apps.sales-assistant-api.tsx` supports voice and text
- Chat widget supports recording, playback, and transcription
- Admin can configure voice settings

## Out of Scope
- Custom voice models (handled by Voice API)
- Non-Shopify storefronts

## Timeline
- Phase 1: API integration (1 week)
- Phase 2: Frontend UI (2 weeks)
- Phase 3: Admin panel (1 week)
- Phase 4: Testing (1 week)

## Dependencies
- Voice API URL and credentials
- Updated database schema for voice settings

## Risks
- CORS issues
- Audio format compatibility

## References
- See `../voice-api-service/VOICE_PRD.md` for backend requirements 