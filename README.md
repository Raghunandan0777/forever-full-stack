# forever-full-stack
# foreverfullStack

# E-commerce App

A full-stack e-commerce application featuring an Admin Dashboard, Backend API, and Frontend Customer Store. This project utilizes the MERN stack (MongoDB, Express.js, React.js, Node.js) to provide a complete shopping experience.


** LIVE DEMO : https://forever-full-stack-frontend-slwl.onrender.com

## Tech Stack

This project is built using the following technologies:

*   **Frontend**: React.js
*   **Admin Dashboard**: React.js
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB

## Project Structure

The project is organized into three main directories:

*   `admin/`: Contains the source code for the Admin Dashboard, allowing administrators to manage products, orders, and users.
*   `backend/`: Contains the server-side code, including API routes, controllers, and database models.
*   `frontend/`: Contains the source code for the customer-facing e-commerce store.

## Setup Instructions

To run this application locally, you will need to set up and run each of the three components: Admin, Backend, and Frontend.

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (Node Package Manager)
*   MongoDB (Local instance or Atlas URI)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and configure your environment variables (e.g., `MONGO_URI`, `PORT`, `JWT_SECRET`).
    > Note: Refer to the source code or contact the repository owner for the required environment variables.
4.  Start the backend server:
    ```bash
    npm start
    ```
    (Or `npm run dev` if a development script is available)

### 2. Admin Dashboard Setup

1.  Open a new terminal and navigate to the admin directory:
    ```bash
    cd admin/admin
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the admin development server:
    ```bash
    npm start
    ```
    (or `npm run dev` / `vite` depending on the project configuration)

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm start
    ```
    (or `npm run dev` / `vite` depending on the project configuration)

## Usage

*   **Backend**: runs on `http://localhost:4000` (or the port specified in your `.env`).
*   **Admin**: accessible via the URL provided by the admin start script (typically `http://localhost:5173` or `http://localhost:3000`).
*   **Frontend**: accessible via the URL provided by the frontend start script.

## Notes

*   Ensure that your MongoDB server is running before starting the backend.
*   The `admin` and `frontend` applications rely on the `backend` server API. Make sure the backend is running for full functionality.
