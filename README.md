This project is a simplified end-to-end AI-powered SaaS prototype that enables users to book appointments through a conversational chatbot interface.

The system demonstrates:

Clean service boundaries

Conversational AI workflow using LangChain

Secure backend architecture

Relational database modeling

Frontend ↔ Backend ↔ AI service integration

This is a functional prototype designed to demonstrate architectural thinking, AI integration, and maintainable system design.
High-Level Architecture
Frontend (React - Vite)
        ↓
Node.js Backend API (Express)
        ↓
Python AI Microservice (LangChain)
        ↓
PostgreSQL Database

Responsibilities
Frontend (React)

Chat UI interface

Authentication handling (JWT)

API communication

Session management

Backend (Node.js + Express)

JWT token generation

Authentication middleware

Request validation

Logging

Rate limiting (basic)

Database persistence

Communication with AI microservice

AI Microservice (Python + LangChain)

LLM integration

Multi-turn conversation management

Appointment booking workflow

Availability validation (simulated)

Interaction logging

Database (PostgreSQL)

User management

Appointment storage

Chat session history

Tech Stack

Frontend:

React (Vite)

Backend:

Node.js

Express

JWT

PostgreSQL (pg)

AI Service:

Python

LangChain

LLM provider (OpenAI or equivalent)

Database:

PostgreSQL

Database Schema
users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

chat_sessions
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id VARCHAR(255),
    message TEXT,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_user ON chat_sessions(user_id);

How to Run the Project Locally
1. Clone Repository
git clone <your-repository-url>
cd AI-chatbot-appointment

2. Setup PostgreSQL

Create database:

CREATE DATABASE appointment_db;


Update backend .env file:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/appointment_db
JWT_SECRET=supersecretkey
PORT=5000

3. Run Backend
cd backend
npm install
npm run dev


Expected output:

PostgreSQL connected
Backend running on port 5000


Test:

http://localhost:5000/health

4. Run AI Microservice
cd ai-service
pip install -r requirements.txt
python main.py


Expected:

AI service running on port 8000

5. Run Frontend
cd frontend
npm install
npm run dev


Open in browser:

http://localhost:5173

Conversational Appointment Flow

User logs in

User initiates conversation:

“I want to book an appointment”

AI collects required details:

Date

Time

AI validates availability (simulated logic)

Appointment record is created in database

Conversation is logged in chat_sessions table

Security Considerations

JWT-based authentication

Token expiration

Middleware-based validation

CORS configuration

Environment variable usage for secrets

No hardcoded credentials

Key Design Decisions

AI service separated as a microservice for scalability and independent deployment.

Backend kept stateless. Conversation state handled within AI layer.

Normalized relational schema for clean data separation.

Simulated availability logic to focus on conversational AI orchestration.

Tradeoffs & Assumptions

No production-grade rate limiting

No OAuth (JWT used instead)

Availability logic is mocked

No streaming responses

No Redis caching layer

No containerization

Scalability Improvements (Future Work)

Redis for session storage

WebSocket streaming responses

Message queue (event-driven architecture)

Vector database for long-term conversation memory

Multi-tenancy support (business_id)

Google/Outlook calendar integration

Dockerized deployment

Known Limitations

Prototype-level validation

Simplified error handling

Basic prompt engineering

Single-instance local deployment

Evaluation Alignment

This prototype demonstrates:

Clear architectural thinking

Practical LLM integration

Clean API boundaries

Relational data modeling

Conversation-driven workflow

Scalable SaaS-ready design foundations