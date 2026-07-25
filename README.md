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
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Full URL of the backend `/api` endpoint |
| `VITE_STRIPE_PUBLISHABLE_KEY` | For checkout | Stripe test-mode publishable key |

Restart Vite after changing an environment variable.

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

The API returns a JWT after registration or login. The client stores it in
`localStorage` as `northstar_token` and sends it in the `Authorization` header:

```text
Authorization: Bearer <token>
```

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

## Production deployment

1. Set `VITE_API_URL` to the deployed API URL.
2. Set `VITE_STRIPE_PUBLISHABLE_KEY`.
3. Run `npm run build`.
4. Deploy the generated `dist` directory.
5. Configure the host to serve `index.html` for unknown routes so React Router
   routes work after a page refresh.
6. Add the deployed frontend origin to the server's `CLIENT_URL`.

## What you need to do

- [ ] Install dependencies with `npm install`.
- [ ] Copy `.env.example` to `.env`.
- [ ] Set the backend API URL.
- [ ] Add a Stripe test publishable key if checkout is needed.
- [ ] Make sure the backend is running.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Configure SPA route fallback on the production host.

## Troubleshooting

### The page is blank

Open the browser console. The built-in error boundary should display render
errors. You can also clear stale client state:

```javascript
localStorage.removeItem("northstar_cart");
localStorage.removeItem("northstar_token");
location.reload();
```

### Product or login requests fail

Confirm `VITE_API_URL`, confirm the API is running, and verify the frontend URL
matches the backend `CLIENT_URL` CORS setting.

### Checkout says Stripe is not configured

Replace the placeholder key in `.env` with a real Stripe test publishable key,
then restart Vite.

