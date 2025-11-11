# Origami App Implementation Plan

## Project Overview

**Goal:** Build a kid-friendly origami learning web app with AI-powered search, deployed on Vercel with device-based authentication.

**Tech Stack:**
- **Frontend:** Next.js 14+ (React, App Router)
- **Styling:** Tailwind CSS
- **Database:** Vercel Postgres (free tier)
- **AI:** OpenAI GPT-4o API
- **Hosting:** Vercel
- **PWA:** next-pwa for installability

---

## Phase 1: Foundation (Week 1)

### 1.1 Project Setup
- [ ] Create Next.js project with TypeScript
- [ ] Install dependencies (Tailwind, OpenAI SDK, database client)
- [ ] Set up Vercel project
- [ ] Configure environment variables

### 1.2 Database Setup
- [ ] Create Vercel Postgres database
- [ ] Design schema:
  ```sql
  -- Devices table (for auth)
  CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_token VARCHAR(255) UNIQUE,
    device_name VARCHAR(255),
    created_at TIMESTAMP,
    last_used TIMESTAMP
  );

  -- Origami cache table (store AI results)
  CREATE TABLE origami_cache (
    id SERIAL PRIMARY KEY,
    query VARCHAR(255),
    name VARCHAR(255),
    difficulty VARCHAR(50),
    category VARCHAR(100),
    steps JSONB,
    source_url TEXT,
    cached_at TIMESTAMP
  );
  ```

### 1.3 Initial Data
- [ ] Create static JSON file with 5-10 popular origami tutorials
  - Dog, Cat, Frog, Crane, Boat, Airplane, Heart, etc.
- [ ] Store in `/public/data/origami-starter.json`

---

## Phase 2: Authentication & Settings System

### 2.1 Device Registration
- [ ] Create `/app/api/auth/register/route.js`
  - Validates family code (from env variable)
  - Generates unique device token (using nanoid)
  - Saves to database
  - Returns device token

### 2.2 Device Verification Middleware
- [ ] Create `/lib/auth.js` helper
  - Function to verify device token
  - Function to update last_used timestamp
  - Export for use in API routes

### 2.3 Frontend Auth Flow
- [ ] Create `<AuthCheck>` component
  - Checks localStorage for device token
  - Shows setup screen if not found
  - Shows main app if authenticated
- [ ] Create setup/welcome page UI
  - Kid-friendly design
  - Family code input
  - Success message

### 2.4 Settings Page (API Key Configuration)
- [ ] Create `/app/settings/page.jsx`
  - Input field for OpenAI API key
  - Save to localStorage (encrypted if possible)
  - Clear/reset API key option
  - Link to OpenAI API key signup
- [ ] Update navigation to include Settings
- [ ] Show warning when API key is not configured

---

## Phase 3: Core UI Components

### 3.1 Layout & Navigation
- [ ] Create main layout with header
- [ ] Create simple, colorful kid-friendly design
- [ ] Add "Home" and "Search" navigation

### 3.2 Search Interface
- [ ] Create search bar component
- [ ] Create category filter buttons (Animals, Toys, Flowers, etc.)
- [ ] Create difficulty filter (Easy, Medium, Hard)
- [ ] Create origami grid/list view

### 3.3 Step-by-Step Viewer
- [ ] Create origami detail page `/app/origami/[id]/page.jsx`
- [ ] Step navigation (Previous/Next buttons)
- [ ] Progress indicator (Step 3 of 12)
- [ ] Large image display
- [ ] Instruction text
- [ ] Zoom capability for images

### 3.4 Browse Static Content
- [ ] Homepage showing starter origami
- [ ] Load from static JSON file
- [ ] Display in grid with thumbnails

---

## Phase 4: AI Search Agent

### 4.1 Web Scraping Setup
- [ ] Install cheerio/puppeteer
- [ ] Create scraper for Origami Resource Center
- [ ] Create scraper for Origami.me (fallback)
- [ ] Handle errors gracefully

### 4.2 OpenAI Integration
- [ ] Create `/app/api/search/route.js`
- [ ] Accept API key from client (user-provided in settings)
- [ ] Implement search flow:
  1. Check cache first (database)
  2. If not found, scrape relevant website
  3. Use GPT-4o with user's API key to parse and structure content
  4. Save to cache
  5. Return structured data
- [ ] Handle API errors (invalid key, rate limits, etc.)
- [ ] Add timeout handling
- [ ] Fallback to cached content if API fails

### 4.3 Content Parsing
- [ ] Create AI prompt template for parsing origami instructions
- [ ] Extract: name, difficulty, category, steps (number, instruction, image)
- [ ] Validate structured output
- [ ] Handle missing images gracefully

---

## Phase 5: Enhanced Features

### 5.1 Rate Limiting
- [ ] Install Upstash Redis (free tier)
- [ ] Implement rate limiting (50 searches/day per device)
- [ ] Show friendly message when limit reached

### 5.2 Favorites/Bookmarks
- [ ] Add "favorite" button on origami detail page
- [ ] Store favorites in localStorage
- [ ] Create "My Favorites" page

### 5.3 Progress Tracking
- [ ] Mark origami as "completed"
- [ ] Show completion badge/checkmark
- [ ] Track in localStorage

---

## Phase 6: PWA & Polish

### 6.1 PWA Configuration
- [ ] Install and configure next-pwa
- [ ] Create app manifest.json
- [ ] Design app icons (multiple sizes)
- [ ] Test "Add to Home Screen" on iPad

### 6.2 Offline Support
- [ ] Cache static origami data
- [ ] Show cached origami when offline
- [ ] Display "offline" message for search

### 6.3 UI Polish
- [ ] Add loading states
- [ ] Add error states with friendly messages
- [ ] Add animations/transitions
- [ ] Test on iPad (responsive design)

---

## Phase 7: Deployment

### 7.1 Vercel Setup
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables:
  - `FAMILY_CODE` - Secret code for device registration
  - `OPENAI_API_KEY` - OpenAI API key
  - `DATABASE_URL` - Vercel Postgres connection
  - `UPSTASH_REDIS_URL` - Redis for rate limiting
- [ ] Test deployment

### 7.2 Database Migration
- [ ] Run SQL migrations on Vercel Postgres
- [ ] Seed with initial data if needed

### 7.3 Testing
- [ ] Test device registration flow
- [ ] Test AI search with various queries
- [ ] Test on iPad Safari
- [ ] Test PWA installation
- [ ] Test offline functionality

---

## File Structure

```
origami/
├── app/
│   ├── layout.jsx                 # Root layout
│   ├── page.jsx                   # Homepage (browse static content)
│   ├── search/
│   │   └── page.jsx               # Search page
│   ├── origami/
│   │   └── [id]/
│   │       └── page.jsx           # Step-by-step viewer
│   ├── favorites/
│   │   └── page.jsx               # Favorites page
│   ├── settings/
│   │   └── page.jsx               # Settings page (API key config)
│   └── api/
│       ├── auth/
│       │   └── register/
│       │       └── route.js       # Device registration
│       └── search/
│           └── route.js           # AI search endpoint
├── components/
│   ├── AuthCheck.jsx              # Auth wrapper component
│   ├── SearchBar.jsx              # Search interface
│   ├── OrigamiCard.jsx            # Thumbnail card
│   ├── OrigamiGrid.jsx            # Grid layout
│   ├── StepViewer.jsx             # Step-by-step viewer
│   └── SetupScreen.jsx            # First-time setup
├── lib/
│   ├── auth.js                    # Auth helpers
│   ├── database.js                # Database client
│   ├── scraper.js                 # Web scraping logic
│   ├── openai.js                  # OpenAI integration
│   └── settings.js                # Settings management (API key storage)
├── public/
│   ├── data/
│   │   └── origami-starter.json   # Static origami data
│   └── images/                    # Static images
├── .env.local                     # Local environment variables
├── next.config.js                 # Next.js + PWA config
├── tailwind.config.js             # Tailwind config
└── package.json
```

---

## Key Data Structures

### Origami Object Format
```typescript
interface Origami {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'animals' | 'toys' | 'flowers' | 'other';
  steps: Step[];
  sourceUrl?: string;
  thumbnailUrl?: string;
}

interface Step {
  stepNumber: number;
  instruction: string;
  imageUrl: string;
}
```

### Device Object Format
```typescript
interface Device {
  id: number;
  deviceToken: string;
  deviceName?: string;
  createdAt: Date;
  lastUsed: Date;
}
```

---

## Environment Variables Needed

```bash
# .env.local (for local development)
FAMILY_CODE=your-secret-family-code-here
POSTGRES_URL=postgres://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Note: OpenAI API key is provided by users in Settings page
# Users enter their own API key which is stored in their browser's localStorage
```

---

## Estimated Timeline

| Phase | Time | Description |
|-------|------|-------------|
| Phase 1 | 1-2 hours | Setup project, database, static data |
| Phase 2 | 2-3 hours | Build auth system |
| Phase 3 | 4-6 hours | Build UI components |
| Phase 4 | 4-6 hours | Implement AI search |
| Phase 5 | 2-3 hours | Add rate limiting & features |
| Phase 6 | 2-3 hours | PWA & polish |
| Phase 7 | 1-2 hours | Deploy & test |
| **Total** | **16-25 hours** | Full implementation |

---

## MVP (Minimum Viable Product)

**If you want to get something working quickly, prioritize:**

1. Project setup (Phase 1.1, 1.2)
2. Simple password auth instead of full device auth (2 hours saved)
3. Static origami data only (Phase 1.3, 3.4)
4. Step viewer (Phase 3.3)
5. Basic UI (Phase 3.1, 3.2)
6. Deploy to Vercel (Phase 7)

**Result:** Working app in 6-8 hours, add AI search later!

---

## Cost Estimates (Monthly)

**For Repository Owner (Hosting the App):**
- **Vercel Hosting:** Free (Hobby tier)
- **Vercel Postgres:** Free (up to 256MB)
- **Upstash Redis:** Free (10K requests/day)
- **Total:** **$0/month**

**For Each User:**
- **OpenAI API:** ~$1-5/month (depends on individual usage)
- Users provide their own API key and pay for their own usage

---

## Implementation Notes

### Device Authentication Flow

**First Time Setup:**
1. User opens app on iPad
2. Prompted to enter family code
3. App generates unique device token
4. Token saved to localStorage
5. Token stored in database
6. User authenticated

**Subsequent Visits:**
1. App reads token from localStorage
2. Sends token with every API request
3. Server validates token against database
4. No re-authentication needed

### AI Search Flow

**User searches for "origami frog":**
1. Check if cached in database → return if found
2. Retrieve user's API key from request (stored in their browser)
3. Search origami websites for relevant content
4. Scrape HTML content and images
5. Send to GPT-4o using user's API key with structured prompt
6. Parse response into Origami object format
7. Save to cache database
8. Return to user

### API Key Management

**User-Provided API Keys:**
- Users enter their OpenAI API key in Settings page
- API key stored in browser's localStorage
- Key sent with each search request to backend
- Backend uses user's key for OpenAI API calls
- Users responsible for their own API costs
- No API keys stored in database or server

**Benefits:**
- Repository can be public (no secrets in code)
- No API costs for app owner
- Users control their own usage and costs
- More transparent and trustworthy

### Security Considerations

- Family code stored as environment variable
- Device tokens are unique, random, and unguessable
- Rate limiting prevents abuse
- User API keys transmitted securely (HTTPS)
- API keys stored only in user's browser (localStorage)
- Database credentials secured in Vercel

---

## Resources

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)

### Origami Content Sources
- [Origami Resource Center](https://origami-resource-center.com/)
- [Origami.me](https://origami.me/)
- [Paper Kawaii](https://www.paperkawaii.com/)
- [OrigamiUSA Free Diagrams](https://origamiusa.org/diagrams/free)

### Tools
- [Vercel](https://vercel.com/) - Hosting
- [GitHub](https://github.com/) - Version control
- [Upstash](https://upstash.com/) - Redis for rate limiting

---

## Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Run `npm run dev` to start development server
5. Open `http://localhost:3000` in your browser

---

## Questions?

If you have any questions or run into issues during implementation, refer to:
- The resources section above
- Next.js documentation for framework-specific questions
- OpenAI documentation for AI integration questions
- This implementation plan for overall architecture

Happy coding!
