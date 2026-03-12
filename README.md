# Car Rental Fullstack Project

This is a premium Car Rental application built with React (Vite) and Node.js (Express).

## Project Structure

- `client/`: React frontend
- `server/`: Express backend

## Deployment Guide

### 1. Environment Variables
Ensure the following variables are set in your production environment (e.g., Vercel Project Settings):

**Backend (`server/`):**
- `MONGODB_URI`: Your production MongoDB connection string.
- `JWT_SECRET`: A long, random string.
- `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key.
- `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key.
- `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint.
- `CLIENT_URL`: The URL of your deployed frontend (to restrict CORS).

**Frontend (`client/`):**
- `VITE_BASE_URL`: The URL of your deployed backend API.
- `VITE_CURRENCY`: Your preferred currency symbol (e.g., `$`).

### 2. Deployment Platforms
- **Vercel**: The project is pre-configured with `vercel.json` files for zero-config deployment. Simply import the root of this repository.
- **Heroku/DigitalOcean**: Use the `start` script in `server/package.json` for the backend and host the `dist/` folder from the client's `npm run build`.

## Production Hardening Included
- ✅ Secure CORS configuration.
- ✅ Global Error Handling for stability.
- ✅ Database connection resilience.
- ✅ Response logging with `morgan`.
- ✅ Mobile-optimized layout and table scrolling.
- ✅ SPA Routing fix for reliable page refreshes.
