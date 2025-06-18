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

## Project Status

**✅ Completed:**

- TypeScript safety (strict mode, no 'any' types)
- Component architecture (6 focused components <200 lines)
- Error boundary for development debugging

**🔄 Next:**

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
