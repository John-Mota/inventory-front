# Autoflex Inventory Manager

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

A modern, responsive, and efficient web application designed to handle industrial inventory management, raw materials scaling, and product production prioritization for **Autoflex**.

## Table of Contents
- [Key Features](#key-features)
- [UI/UX & Design Philosophy](#uiux--design-philosophy)
- [Architecture & State Management](#architecture--state-management)
- [Business Rules Integration](#business-rules-integration)
- [Technologies Used](#technologies-used)
- [Configuration and Setup](#configuration-and-setup)

---

## Key Features

- **Interactive Dashboard (RF008):** A high-level overview of the operation, featuring real-time insights into total revenue potential, warnings for low stock levels, and precise suggestions on what products can be immediately produced based on the actual raw materials available.
- **Dynamic Material Association (RF007):** A fluid and intuitive product creation form that enables users to dynamically search, add, and associate existing raw materials and define the specific required quantities for each assembled product.
- **Responsive Interface:** Fully optimized experiences across desktop, tablet, and mobile browsers, ensuring continuous access to operations data directly from the factory floor or management office.
- **CRUD Operations:** Complete end-to-end management for both Raw Materials and Products, allowing users to keep their entire industrial supply chain updated.

---

## UI/UX & Design Philosophy

The user interface was crafted specifically for **operational efficiency in industrial environments**. 
By utilizing high-contrast visuals, prominent actionable buttons, and clean data tables, the design reduces cognitive load and allows workers or managers to process inventory statuses at a glance. Real-time feedback via Modals, clear validation boundaries on forms, and instantly recognizable warning states prevent crucial factory errors during high-speed data entry.

---

## Architecture & State Management

The frontend architectural backbone relies heavily on the **Redux Toolkit (RTK)** for centralized, predictable state management.

### Handling Asynchronous API Calls
We utilize **Redux Thunks (`createAsyncThunk`)** to manage complex, asynchronous workflows targeting our Render-hosted backend API. 
By delegating all side-effects (like fetching, creating, updating, or deleting inventory data via Axios) directly to Thunks:
- We elegantly separate business logic from UI components.
- The `InventoryState` slice inherently responds to standard lifecycle actions (`pending`, `fulfilled`, `rejected`) out of the box.
- Error handling and loading states become globally accessible and inherently consistent across the entire application interface.

---

## Business Rules Integration

### Highest Value Prioritization (RF004)
The core intelligence of Autoflex Inventory Manager lies in its production suggestions. When calculating what the factory can assemble with its current raw material stock, the system adheres strictly to the **Prioritization of Higher Value Products**. In scenarios where raw materials are disputed among multiple product recipes, the system automatically redirects stock allocation to map out the assembly of products that generate the highest total market value, maximizing operational revenue.

---

## Technologies Used

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/) + React Testing Library

---

## Configuration and Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and your preferred package manager (npm, yarn, or pnpm) installed.

### 1. Clone the repository
```bash
git clone https://github.com/John-Mota/inventory-front.git
cd inventory-front
```

### 2. Environment Variables
Your frontend needs to know where the backend API is hosted. You must define this via the `VITE_API_URL` environment variable.

Create a `.env` file at the root of the project:
```env
# Example configuration targeting a local environment or a Render backend
VITE_API_URL=https://your-api-name.onrender.com
```
*Note: Vite requires custom environment variables to be prefixed with `VITE_` to expose them to the client-side code.*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Run the Test Suite
```bash
# Run tests with output observation
npm run test

# Run tests and evaluate coverage
npm run coverage
```
