# CLO-SET Assessment

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The project implements a **content listing and filtering system** for the CLO-SET CONNECT Store Page using **Next.js App Router**, **Redux Toolkit**, and **Emotion**.

---

## Architecture Overview

### Project Structure

- **`app/`** – Next.js App Router
  - **`page.tsx`** – Server Component
  - **`Client.tsx`** – Client Component handling UI interactivity
- **`store/`** – Redux Toolkit store
  - Contains **slices** for content list, filters, and pagination
- **`components/`** – Reusable React components
- **`hooks/`** – Custom hooks (e.g., for infinite scroll, filtering)
- **`lib/`** – API service calls and utility functions
- **`types/`** – TypeScript types and enums

---

### Server & Client Components

- **Server Component (`page.tsx`)**

  - Responsible for **initial data fetching** via API service calls
  - Passes raw data to the Client Component as props

- **Client Component (`Client.tsx`)**
  - Handles **interactivity, filtering, and pagination**
  - Uses **Redux Toolkit** to manage state (filters, search keywords, content list, pagination)
  - Implements **infinite scroll** and updates the UI dynamically

---

### State Management

- **Redux Toolkit** manages:

  - Content list
  - Pricing filters (Paid / Free / View Only)
  - Keyword search
  - Pagination / infinite scroll

- **Filtering logic** is implemented **on the client** via Redux slices
- **Server Components** **do not manage state**—they only provide initial data

---

### Styling

- All styling is implemented using **Emotion styled components**
- Components follow a modular design and are **responsive** based on screen width:
  - 4 columns (default)
  - 3 columns (<1200px)
  - 2 columns (<768px)
  - 1 column (<480px)

---

### Data Flow

1. **Server Component (`page.tsx`)** calls **services in `lib/`** to fetch content from the API.
2. **Client Component (`Client.tsx`)** receives data and populates Redux store.
3. User interactions in the Client Component:
   - Filter selection → Redux slice updates content list
   - Keyword search → Redux slice updates filtered list
   - Pagination / infinite scroll → Redux slice appends more items

---

### Key Libraries

- **Next.js App Router** – Server + Client components
- **Redux Toolkit** – State management for filters, content, pagination
- **Axios** – API requests
- **Emotion** – CSS-in-JS for styled components

---

### Running the Project

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 to see the app.
