# Spotify Clone Frontend

This is the front-end for a Spotify clone application built with React and styled using Shadcn/UI. The application replicates core Spotify functionalities such as music streaming, playlist management, user messaging, and includes an Admin Dashboard for managing users, songs, and playlists.

## Table of Contents

```
- Features
- Technologies
- Prerequisites
- Installation
- Running the Application
- Project Structure
- Admin Dashboard
- Contributing
- License
```

### Features

User Interface:
Browse and search for songs, artists, and playlists.
Create, edit, and delete playlists.
Stream music and view song details.
Messaging system to chat with other users.

Admin Dashboard:
Manage users (view, edit, delete).
Upload and manage songs, albums and playlists.

Responsive design optimized for desktop and mobile.
Modern UI with components from Shadcn/UI.

### Technologies

```
React: JavaScript library for building user interfaces.
Shadcn/UI: Component library for accessible and customizable UI.
Tailwind CSS: Utility-first CSS framework (used with Shadcn/UI).
Axios: For making HTTP requests to the backend API.
React Router: For client-side routing.
```

### Prerequisites

Before setting up the project, ensure you have the following installed:

```
Node.js (version 18 or higher)
npm or yarn (package managers)
Git
A running backend API (e.g., the Spotify Clone Backend)
```

### Installation

Follow these steps to set up the project locally:

### Clone the repository:

```bash
git clone https://github.com/delvintrung/spotify-clone.git
cd spotify-clone/frontend
```

Install dependencies:

```
npm install
```

### Set up environment variables:

Create a .env file in the project root and add the following:

```bash
VITE_CLERK_PUBLISHABLE_KEY=
PORT=
```

Replace http://localhost:8000/api with your backend API URL.
Replace your_clerk_publishable_key with your Clerk publishable key (if using Clerk for authentication).

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will run at http://localhost:3000 (or another port if specified).

Access the application:

Open http://localhost:3000 in your browser to view the main application.
Navigate to http://localhost:3000/admin to access the Admin Dashboard (requires admin privileges).

### Project Structure

```
spotify-clone/
      └── frontend/
            ├── public/                  # Static assets (e.g., favicon, images)
            ├── src/
            │   ├── layout/              # Images, fonts, etc.
            │   ├── components/          # Reusable React components (e.g., buttons,
            │   │                                                                   cards)
            │   ├── pages/               # Page components (e.g., Home, Playlist, Admin)
            │   ├── providers/
            │   ├── lib/                 # Utility functions and Shadcn/UI setup
            │   ├── stores/              # Custom React hooks
            │   ├── types/               # Route definitions (React Router)
            │   ├── App.tsx              # Main app component
            │   └── main.tsx             # Entry point
            │                            # Global styles and Tailwind CSS
            ├── .env                    # Environment variables
            ├── .eslintrc.cjs           # ESLint configuration
            ├── vite.config.js          # Vite configuration
            ├── tailwind.config.js       # Tailwind CSS configuration
            ├── package.json            # Project dependencies and scripts
            └── README.md               # This file

```

### Admin Dashboard

The Admin Dashboard is accessible at /admin and is designed for administrators to manage the platform. Key features include:

```
User Management: View, edit, or delete user accounts.
Song Management: Upload new songs, edit metadata, or remove songs.
Playlist Management: Approve or delete user-created playlists.
Album Management: View, edit, or delete albums.
```

### Accessing the Admin Dashboard

Ensure you are logged in with an admin account (configured via the backend).
Navigate to http://localhost:3000/admin.
The dashboard uses Shadcn/UI components for a clean, modern interface.

### License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
