# Body Measurement Camera App

React + Next.js + TypeScript camera app for body measurements.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

```bash
# .env.local
BODYGRAM_API_KEY=your_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run verify` - Test core functionality
- `npm run format` - Format code

## Multi-Page Navigation Plan

**Converting from single-page to multi-page app with URL + state navigation**

### Phase 1: Navigation Infrastructure ✅

- [x] Create Next.js App Router structure
- [x] Build navigation state manager (NavProvider)
- [x] Add navigation bar component
- [x] Create consistent page layout wrapper

### Phase 2: Page Migration

- [x] Extract camera functionality to `/camera` route
- [ ] Move photo gallery to `/gallery` route
- [ ] Move measurements to `/measurements` route
- [x] Create settings page at `/settings`

### Phase 3: Enhanced UX

- [ ] Add page transitions and animations
- [ ] Implement breadcrumbs/progress indicators
- [ ] Ensure deep linking support
- [ ] Polish navigation experience

## Project Status

**✅ Completed:**

- TypeScript safety (strict mode, no 'any' types)
- Component architecture (20 focused components <200 lines)
- Modular business logic with service/validation layers
- Production-ready logging system
- Real-time photo refresh with event-driven updates
- Multi-page navigation infrastructure (URL + state hybrid)
- Camera functionality migrated to dedicated route

**🔄 Current Focus:**

- Gallery and measurements page migration

**📋 Backlog:**

- React Query for server state
- Testing infrastructure
- Performance optimization

## API Endpoints

- `GET /api/images?userId=X&type=front|side` - Fetch user photos
- `POST /api/images` - Upload photos
- `GET /api/process?userId=X` - Get measurements
- `POST /api/process` - Process measurements

## Architecture

- **Container components** - data fetching/business logic
- **Presentation components** - UI only
- **Custom hooks** - API calls and complex state
- **TypeScript interfaces** - type safety
