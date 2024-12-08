# Cyclic-Resonance

Cyclic-Resonance is a tool designed to help players of gacha games track and manage their game profiles and in-game resources. It centralizes data from multiple gacha games, making it easier for players to stay organized and informed about their progress, resources, and game events.

## Project Description

Cyclic-Resonance consists of two main components:

- **Frontend**: A web interface to interact with the data, view game stats, and manage user profiles.
- **Backend**: An API server responsible for managing the data, handling user authentication, and interfacing with the database.

The app is designed to support multiple gacha games, providing a centralized hub for players to track their resources, progress, and events across different games.

## Setup Instructions

### 1. Sign Up and Configure Kinde Auth.

Once registered, create / add a new business - setting the name, kinde domain, and region.

Select use an existing codebase and select node.js backend

Specify the options you want for user sign in

Click view details for the node.js app

Configure the following and ensure they are included:

```
Allowed Callback URLs
http://localhost:5173/api/callback

Allowed logout redirect URLs
http://localhost:5173
```

Ensure you hit save after making changes.

### 2. Set Up Environment Variables

Create a .env file in the root of the project based on the .env.example file provided.

All kinde details can be found in the details section of the application on the Kinde webpage.

```bash
cp .env.example .env
```

- KINDE_DOMAIN: The domain for the KindeAuth authentication service (used for OAuth login).
- KINDE_CLIENT_ID: Your KindeAuth application's client ID for OAuth authentication.
- KINDE_CLIENT_SECRET: Your KindeAuth application's client secret.
- KINDE_REDIRECT_URL: The URL to which users will be redirected after authentication.
- KINDE_LOGOUT_REDIRECT_URL: The URL to which users will be redirected after logout.
- DATABASE_URL: The connection string for your PostgreSQL database (e.g. postgresql://username:password@localhost:5432/database_name).

### 3. Install Backend Dependencies

From the root folder of the project:

```bash
bun i
```

### 4. Set Up PostgreSQL Database

Configure your DATABASE_URL in the .env file with the correct database connection string.

```env
DATABASE_URL=postgresql://username:password@localhost:5432/cyclic_resonance
```

### 5. Run Drizzle Migration

From the root folder

```bash
bun drizzle-kit migrate
```

### 6. Run Backend API server

From the root folder

```bash
bun run dev
```

### 7. Set Up the Frontend & Install Frontend Dependencies

Navigate to the frontend directory:

```bash
cd frontend
bun i
```

### 8. Run the Frontend Server

In the frontend directory:

```bash
bun run dev
```

### 9. Access the app

The app will be accessible at http://localhost:5173
