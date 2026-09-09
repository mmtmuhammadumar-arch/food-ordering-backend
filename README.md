# Student API / Food Ordering Backend

Express + MongoDB backend with auth, students, posts, 4 relations, and a
food-ordering e-commerce module (products, cart, checkout with Stripe).

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/studentdb
JWT_SECRET=replace_this_with_a_long_random_string
STRIPE_SECRET_KEY=sk_test_your_key_here
CLIENT_URL=http://localhost:3000
```

- `MONGO_URI` — your MongoDB Atlas connection string (or local MongoDB).
- `STRIPE_SECRET_KEY` — from your Stripe test dashboard.
- `CLIENT_URL` — where your Next.js frontend runs. CORS and Stripe's
  success/cancel redirect URLs both use this.

## 3. Run the server

```bash
npm run dev
```

Server runs on `http://localhost:4000`.

## Routes

### Auth
- `POST /api/auth/register` — { name, email, password, age }
- `POST /api/auth/login` — { email, password } -> { token, user }

### Students
- `GET /api/students` (protected)
- `GET /api/students/:id`
- `PUT /api/students/:id` (protected)
- `DELETE /api/students/:id` (protected)

### Profile (one-to-one)
- `POST /api/profile` (protected) — create/update own profile
- `GET /api/profile/me` (protected)

### Courses (many-to-many)
- `POST /api/courses` (protected)
- `GET /api/courses`
- `POST /api/courses/enroll` (protected) — { courseId }

### Posts (many-to-one / one-to-many)
- `POST /api/posts` (protected, multipart with `image`)
- `GET /api/posts`
- `GET /api/posts/:id`
- `PUT /api/posts/:id` (protected)
- `DELETE /api/posts/:id` (protected)

### Products / Food items
- `GET /api/products` — public menu list
- `GET /api/products/:id`
- `POST /api/products` (protected, multipart with `image`)
- `PUT /api/products/:id` (protected)
- `DELETE /api/products/:id` (protected)

### Cart (protected)
- `POST /api/cart/add` — { productId, quantity }
- `GET /api/cart`
- `DELETE /api/cart/remove/:productId`
- `DELETE /api/cart/clear`

### Orders / Checkout
- `POST /api/orders/checkout` (protected) — { address, phone, items: [{ productId, quantity }] } ->
  creates Order + Stripe Checkout Session (with `invoice_creation` enabled),
  returns `{ url }` to redirect to. The cart itself lives in the frontend's
  browser storage, not the database — items are sent directly at checkout.
- `GET /api/orders/verify-payment?session_id=...` — call after Stripe redirect.
  On success, marks the order "paid" and saves the full Stripe invoice
  (id, number, hosted URL, PDF link, amount, currency) onto the order.
- `GET /api/orders` (protected) — logged-in student's order history, each
  order includes an `invoice` object once paid

## Connecting the Next.js frontend

This matches the `food-ordering-frontend` project's `src/lib/api.js` exactly,
as long as `NEXT_PUBLIC_API_URL` in the frontend's `.env.local` is set to:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

CORS is already enabled in `server.js` for `CLIENT_URL`.
