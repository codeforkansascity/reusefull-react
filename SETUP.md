# RE-USEFULL React App Setup

## Overview

This is a modern React application built with TanStack Router, TanStack Query, and Tailwind CSS v4. It connects to your existing Lambda functions to provide a beautiful donation matching platform.

## Features

- Modern, responsive design with Tailwind CSS v4
- Type-safe routing with TanStack Router
- Efficient data fetching with TanStack Query
- Beautiful UI components with consistent design system
- Integration with your existing Lambda APIs

## Setup Instructions

### 1. Environment Configuration

**IMPORTANT:** The app is now configured with your Lambda URL as a fallback, but you can still override it with a `.env` file:

```env
VITE_API_BASE_URL=https://72m57zkngqsdsomp6ameqd2c6u0wqflv.lambda-url.us-east-2.on.aws
```

**Current Configuration:**

- Default Lambda URL: `https://72m57zkngqsdsomp6ameqd2c6u0wqflv.lambda-url.us-east-2.on.aws`
- The app will use this URL if no environment variable is set
- You can override it by creating a `.env` file with `VITE_API_BASE_URL`

The environment variable is properly typed in `src/vite-env.d.ts` and accessed via `import.meta.env.VITE_API_BASE_URL` in the code.

### 2. Lambda API Endpoints

The app expects the following Lambda function endpoints:

- `GET /item-types` - Returns list of item types
- `GET /charity-types` - Returns list of charity types
- `GET /organizations` - Returns list of organizations
- `GET /org-items` - Returns charity-to-item mappings

### 3. Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Integration

The app is already configured to work with your Lambda functions:

1. **GetItemTypes** - Fetches available item types for donation
2. **GetCharityTypes** - Fetches charity categories
3. **GetOrgs** - Fetches all approved charities
4. **GetOrgItems** - Fetches which items each charity accepts

## File Structure

```
src/
├── api/
│   └── charityApi.ts          # API integration functions
├── components/
│   └── ui/                    # Reusable UI components
├── routes/
│   ├── index.tsx              # Landing page
│   ├── donate.tsx             # Donation form
│   ├── donate/
│   │   └── results.tsx        # Results page
│   └── charity/
│       └── $charityId.tsx     # Charity details
├── types/
│   └── api.ts                 # TypeScript types
└── utils/
    └── cn.ts                  # Utility functions
```

## Customization

### Styling

The app uses a custom color palette defined in `src/index.css`. You can modify the `@theme` section to change colors.

### Components

All UI components are in `src/components/ui/` and use Tailwind Variants for consistent styling.

### API Integration

Modify `src/api/charityApi.ts` to adjust how data is fetched and transformed.

## Deployment

1. Build the app: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update the `VITE_API_BASE_URL` environment variable with your production API Gateway URL

## Next Steps

1. Deploy your Lambda functions to AWS
2. Set up API Gateway with CORS enabled
3. Update the environment variables with your actual API URLs
4. Test the full donation flow
5. Add any additional features or customizations needed
