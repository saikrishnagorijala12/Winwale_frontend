# Winwale Frontend

Winwale Frontend is a modern web application built to interact with the
Winwale backend APIs.\
It provides a clean user interface and communicates with backend
services using REST APIs.

------------------------------------------------------------------------

## Tech Stack

-   React
-   Vite
-   JavaScript
-   Axios (for API calls)

------------------------------------------------------------------------

## Project Purpose

This project serves as the frontend application for the Winwale system.\
It connects to backend services, displays data, and handles user
interactions.

------------------------------------------------------------------------

## Getting Started

### 1. Clone the Repository

``` bash
git clone https://github.com/saikrishnagorijala12/Winwale_frontend.git
cd Winwale_frontend
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Run Development Server

``` bash
npm run dev
```

The app will run at:

    http://localhost:5173

------------------------------------------------------------------------

## Build for Production

``` bash
npm run build
```

This will generate a `dist/` folder containing optimized production
files.

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the root directory if required:

    VITE_API_URL=http://localhost:8000

Use in code:

    import.meta.env.VITE_API_URL

------------------------------------------------------------------------

## Deployment (S3 + CloudFront)

1.  Run production build:

    ``` bash
    npm run build
    ```

2.  Upload the contents of the `dist/` folder to your S3 bucket.

3.  Configure CloudFront:

    -   Set default root object to `index.html`
    -   Configure custom error response (403/404 → `/index.html` with
        200 status)

4.  Invalidate CloudFront cache after deployment.

------------------------------------------------------------------------

## Project Structure (Typical)

    Winwale_frontend/
    │
    ├── src/
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js

------------------------------------------------------------------------

## Author

Sreya Gujja and Sai Krishna Gorijala

------------------------------------------------------------------------

## License

This project is intended for development and learning purposes.
