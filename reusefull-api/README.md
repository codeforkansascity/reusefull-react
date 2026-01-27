Reusefull API (local dev)

Run a local Node.js + Express API that will later be deployed to AWS Lambda.

Setup

1) Install deps

```bash
cd reusefull-api
npm install
```

2) Create a .env file

```ini
PORT=3001

# Auth0
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://reusefull-api

# Local MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reusefull
DB_USER=root
DB_PASSWORD=your_password

# Optional: shared secret for /users called by Auth0 Action
ACTION_SHARED_SECRET=change_me

# CORS for your React app
CORS_ORIGIN=http://localhost:5173
```

3) Start the API

```bash
npm run dev
# http://localhost:3001/health
```

Auth

- The API validates Auth0 access tokens (audience must match AUTH0_AUDIENCE).
- Use getAccessTokenSilently in the React app and send Authorization: Bearer <token>.

Endpoints

- POST /users
  - Upsert a user record. Intended to be called by an Auth0 Action after signup.
  - Accepts JSON: { sub, email, email_verified }
  - Optionally require header: x-action-secret: ACTION_SHARED_SECRET

- PUT /charity-signup/draft  (JWT required)
  - Saves step data for the current user (identified by token sub).
  - Body: any JSON; stored as JSON in DB.

- POST /charity-signup/submit (JWT required)
  - Writes a final, immutable submission for the current user.

- GET /me (JWT required)
  - Returns { user, draft } for the current user.

Database

Adjust table/column names in src/app.ts to match your schema:

- users(sub UNIQUE, email, email_verified, created_at, updated_at)
- charity_signup_drafts(user_sub UNIQUE, payload JSON, updated_at)
- charity_signup_submissions(user_sub, payload JSON, created_at)

Moving to AWS

- Wrap with serverless-http for Lambda.
- Put Lambda in same VPC and subnets as RDS; secure SGs.
- Prefer RDS Proxy; move DB creds to Secrets Manager.



