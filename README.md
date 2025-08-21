# AURA-REAL-ESTATE

Aura Homes is a modern real estate platform that provides clients with a personalized and intuitive way to find their ideal property, while empowering agents with powerful tools for managing leads, properties, and client interactions.

## Features

- **User Authentication**
  - User registration with email and password
  - Secure login with JWT token authentication
  - Protected routes for authenticated users
  - Secure logout functionality

- **Property Management** (Coming Soon)
  - Property listings with detailed information
  - Property search and filtering
  - Image gallery for properties
  - Property status tracking

- **Lead Management** (Coming Soon)
  - Lead capture and tracking
  - Lead status management
  - Communication history

- **Client Interaction** (Coming Soon)
  - Client profiles
  - Message system
  - Property favorites
  - Viewing appointments

## Tech Stack

### Backend
- Python 3.13
- Flask
- PostgreSQL
- SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

## Setup Instructions

### Prerequisites
- Python 3.13 or higher
- Node.js and npm
- PostgreSQL database

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/404error-notfound/AURA-REAL-ESTATE.git
   cd AURA-REAL-ESTATE
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Unix or MacOS:
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install flask flask-sqlalchemy flask-jwt-extended flask-cors python-dotenv psycopg2-binary
   ```

4. Create a `.env` file in the backend directory:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost/aurare
   JWT_SECRET_KEY=your-secret-key-here
   SECRET_KEY=another-secret-key-here
   ```

5. Create PostgreSQL database:
   ```sql
   CREATE DATABASE aurare;
   ```

6. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user
- Request body:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Registration successful"
  }
  ```

#### POST /api/auth/login
Login user
- Request body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "id": "number",
        "name": "string",
        "email": "string"
      }
    }
  }
  ```

### Properties (Coming Soon)

#### GET /api/properties
Get list of properties

#### POST /api/properties
Create new property listing

#### GET /api/properties/{id}
Get property details

### Leads (Coming Soon)

#### GET /api/leads
Get list of leads

#### POST /api/leads
Create new lead

### Communications (Coming Soon)

#### GET /api/communications
Get messages/communications

#### POST /api/communications
Send new message

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
