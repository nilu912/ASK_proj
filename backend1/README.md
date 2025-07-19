# ASK Foundation Backend API

This is the backend API for the ASK Foundation website. It provides endpoints for managing directors, events, gallery, inquiries, donations, and user authentication.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Multer for file uploads
- Nodemailer for email sending

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory

```bash
cd backend
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file based on `.env.example`

```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration

### Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm start
```

### Initialize Database

Create an admin user in the database:

```bash
npm run init-db
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/create-admin` - Create admin user (admin only)

### Directors

- `GET /api/directors` - Get all directors
- `GET /api/directors/:id` - Get director by ID
- `POST /api/directors` - Create director (admin only)
- `PUT /api/directors/:id` - Update director (admin only)
- `DELETE /api/directors/:id` - Delete director (admin only)
- `POST /api/directors/:id/photo` - Upload director photo (admin only)

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `POST /api/events/:id/image` - Upload event image (admin only)
- `POST /api/events/:id/register` - Register for event (public)
- `GET /api/events/:id/registrations` - Get event registrations (admin only)

### Gallery

- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/:id` - Get gallery item by ID
- `POST /api/gallery` - Create gallery item (admin only)
- `PUT /api/gallery/:id` - Update gallery item (admin only)
- `DELETE /api/gallery/:id` - Delete gallery item (admin only)
- `POST /api/gallery/:id/media` - Upload gallery media (admin only)
- `POST /api/gallery/:id/thumbnail` - Upload gallery thumbnail (admin only)

### Inquiries

- `GET /api/inquiries` - Get all inquiries (admin only)
- `GET /api/inquiries/stats` - Get inquiry statistics (admin only)
- `GET /api/inquiries/:id` - Get inquiry by ID (admin only)
- `POST /api/inquiries` - Create inquiry (public)
- `PUT /api/inquiries/:id` - Update inquiry (admin only)
- `DELETE /api/inquiries/:id` - Delete inquiry (admin only)
- `POST /api/inquiries/:id/attachment` - Upload inquiry attachment (public)
- `PUT /api/inquiries/:id/assign` - Assign inquiry to user (admin only)

### Donations

- `GET /api/donations` - Get all donations (admin only)
- `GET /api/donations/stats` - Get donation statistics (admin only)
- `GET /api/donations/:id` - Get donation by ID (admin only)
- `POST /api/donations` - Create donation (public)
- `PUT /api/donations/:id` - Update donation (admin only)
- `DELETE /api/donations/:id` - Delete donation (admin only)
- `POST /api/donations/:id/receipt` - Upload donation receipt (admin only)

## Project Structure

```
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.ts         # Entry point
├── .env                  # Environment variables
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Error Handling

The API uses a centralized error handling mechanism with custom AppError class and error middleware.

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected routes require a valid token in the Authorization header or in cookies.

## File Uploads

File uploads are handled using Multer middleware. Files are stored in the `uploads` directory with subdirectories for different file types (images, videos, documents).

## License

This project is licensed under the MIT License.