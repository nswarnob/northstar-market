# Northstar Market — Client

The React storefront for Northstar Market. This repository contains the
customer-facing shop, authentication screens, cart, Stripe checkout, order
history, product reviews, and the administrator dashboard.

## Technology

- React 19
- React Router
- Vite
- Tailwind CSS 4
- Axios
- Firebase Authentication
- Stripe Elements

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A running Northstar Market API
- A Stripe test publishable key for checkout

## Installation

```bash
npm install
cp .env.example .env
```

Update `.env`, then start the development server:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

Create `.env` in the repository root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_FIREBASE_API_KEY=your_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_web_app_id
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Full URL of the backend `/api` endpoint |
| `VITE_STRIPE_PUBLISHABLE_KEY` | For checkout | Stripe test-mode publishable key |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase web application ID |

Restart Vite after changing an environment variable.

## Firebase Authentication setup

1. Open the Firebase Console and create or select a project.
2. Add a **Web app** under **Project settings → General**.
3. Copy the web configuration values into the matching `VITE_FIREBASE_*`
   variables.
4. Open **Authentication → Sign-in method**.
5. Enable **Email/Password**.
6. Under **Authentication → Settings → Authorized domains**, add the deployed
   Vercel client hostname without `https://`, for example:

   ```text
   your-client-project.vercel.app
   ```

Firebase manages password storage, password hashing, session persistence, and
ID-token refresh.

## Available commands

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Tailwind CSS

Tailwind CSS uses the official `@tailwindcss/vite` plugin configured in
`vite.config.js`. It is imported by `src/styles.css`.

Northstar theme utilities include:

```text
bg-northstar-cream
text-northstar-ink
text-northstar-orange
border-northstar-line
font-display
```

The existing component classes in `src/styles.css` provide the established
Northstar design. New component-specific styling can use Tailwind utilities.

## Application routes

| Route | Access |
| --- | --- |
| `/` | Public |
| `/products` | Public |
| `/products/:id` | Public |
| `/cart` | Public |
| `/login` | Public |
| `/register` | Public |
| `/checkout` | Authenticated |
| `/orders` | Authenticated |
| `/order-confirmation/:id` | Authenticated |
| `/admin` | Administrator |

## Authentication

Firebase Authentication owns email/password credentials and browser sessions.
The client retrieves the signed-in user's Firebase ID token and sends it to the
API in the `Authorization` header:

```text
Authorization: Bearer <firebase-id-token>
```

The Express API verifies the token with Firebase Admin, then loads the
application profile and role from MongoDB. Passwords are never sent to or
stored by the Express API.

The cart is stored locally as `northstar_cart`. The error boundary offers a
cart reset if invalid persisted data prevents rendering.

## Stripe test checkout

Add a real `pk_test_...` key to `.env`. The backend must also have the matching
Stripe test secret key.

Stripe's standard successful test card is:

```text
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any three digits
Postal code: Any valid value
```

The client never calculates the authoritative payment amount. The API reads
current product prices and creates the PaymentIntent.

## Deploy to Vercel

The repository includes `vercel.json`. It selects the Vite framework and
rewrites browser routes to `index.html`, so React Router routes continue to
work when refreshed.

Deploy the server repository first, then:

1. Push this `client` folder to its own GitHub, GitLab, or Bitbucket repository.
2. In Vercel, select **Add New → Project** and import the client repository.
3. Confirm the framework preset is **Vite**.
4. Keep the project root as `.` because this is a standalone repository.
5. Add these variables under **Settings → Environment Variables**:

   ```env
   VITE_API_URL=https://your-server-project.vercel.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   VITE_FIREBASE_API_KEY=your_web_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_web_app_id
   ```

6. Apply the variables to Production and Preview as needed.
7. Select **Deploy**.
8. Copy the deployed frontend origin, such as
   `https://your-client-project.vercel.app`.
9. Add that exact origin to the server project's `CLIENT_URL` and redeploy the
   server.
10. Add `your-client-project.vercel.app` to Firebase Authentication's
    authorized domains.

Vite variables are embedded during the build. Changing one in Vercel requires
a new deployment.

You can also deploy with Vercel CLI 47.0.5 or newer:

```bash
npx vercel
npx vercel --prod
```

## What you need to do

- [ ] Install dependencies with `npm install`.
- [ ] Copy `.env.example` to `.env`.
- [ ] Set the backend API URL.
- [ ] Create a Firebase web app and enable Email/Password Authentication.
- [ ] Add all `VITE_FIREBASE_*` values.
- [ ] Add a Stripe test publishable key if checkout is needed.
- [ ] Make sure the backend is running.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Deploy the server repository first.
- [ ] Add Vercel environment variables.
- [ ] Deploy this repository to Vercel.
- [ ] Add the resulting frontend URL to the server's `CLIENT_URL`.

## Troubleshooting

### The page is blank

Open the browser console. The built-in error boundary should display render
errors. You can also clear stale client state:

```javascript
localStorage.removeItem("northstar_cart");
location.reload();
```

### Product or login requests fail

Confirm `VITE_API_URL`, confirm the API is running, and verify the frontend URL
matches the backend `CLIENT_URL` CORS setting.

### Checkout says Stripe is not configured

Replace the placeholder key in `.env` with a real Stripe test publishable key,
then restart Vite.
