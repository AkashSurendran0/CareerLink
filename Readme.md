# CareerLink – AI-Powered Professional Networking & Recruitment Platform

## Overview

CareerLink is a full-stack, AI-powered professional networking and recruitment platform designed to streamline the hiring process for both job seekers and recruiters.

The platform combines professional networking, job discovery, AI-assisted resume generation, real-time communication, and recruitment management into a single ecosystem.

For job seekers, CareerLink helps generate tailored resumes and cover letters based on job descriptions, increasing the likelihood of being shortlisted by recruiters.

For recruiters, CareerLink provides an end-to-end hiring workflow where they can post jobs, manage applicants, communicate with candidates, schedule interviews, and make hiring decisions without switching between multiple platforms.

---

## Key Highlights

- AI-Powered Resume Generation
- AI-Powered Cover Letter Creation
- Professional Networking Platform
- Real-Time Messaging
- Voice & Video Calling
- Job Posting & Recruitment Management
- Event-Driven Microservices Architecture
- Distributed Database Design
- Scalable API Gateway Pattern
- Redis-Based Caching Layer
- Elasticsearch Search Capabilities
- RabbitMQ Message Queue Integration
- Dockerized Infrastructure
- Cloud Deployment with Cloudflare Protection

---

## System Architecture

The platform follows a Microservices Architecture where each service owns its domain logic and database.

### Core Services

| Service | Responsibility |
|----------|---------------|
| API Gateway | Request routing, authentication, authorization |
| User Service | User profiles, account management |
| Company Service | Company registration and management |
| Job Service | Job posting and applicant management |
| Resume Service | Resume storage and generation |
| AI Service | AI-powered resume and cover letter generation |
| Chat Service | Real-time messaging and communication |
| Notification Service | User notifications |
| Subscription Service | Subscription and payment management |
| Post Service | Professional networking feed |
| Report Service | Content moderation and reporting |
| Admin Service | Platform administration |

---

## Architecture Principles

### API Gateway Pattern

All client requests are routed through a centralized API Gateway responsible for:

- Authentication
- Authorization
- Request forwarding
- Service abstraction

### Database Per Service Pattern

Each microservice maintains ownership of its own database, enabling:

- Independent scaling
- Better fault isolation
- Loose coupling
- Improved maintainability

### Event-Driven Communication

RabbitMQ is used for asynchronous communication between services.

Benefits:

- Service decoupling
- Improved scalability
- Reliable event processing
- Better fault tolerance

---

## Core Features

### Authentication & Authorization

- Secure User Registration
- Secure Login
- JWT Authentication
- Role-Based Authorization
- Recruiter Accounts
- Applicant Accounts
- Admin Accounts

---

### Professional Networking

- Create Posts
- Like Posts
- Comment on Posts
- Build Professional Presence
- Connect With Other Professionals

---

### User Profile Management

- Personal Profile Creation
- Profile Picture Upload
- Skills Management
- Education Details
- Professional Summary
- Social Links Integration

---

### Job Management

#### Recruiter Features

- Company Registration
- Job Posting Creation
- Applicant Management
- Candidate Screening
- Accept Candidates
- Reject Candidates
- Hire Candidates

#### Applicant Features

- Browse Jobs
- Apply for Jobs
- Upload Resume
- Track Applications
- Manage Job Applications

---

### AI Features

CareerLink leverages AI to simplify the application process.

#### Resume Generation

Generate professional resumes tailored to specific job descriptions.

#### Cover Letter Generation

Create customized cover letters optimized for individual job applications.

#### Resume Optimization

Improve resume relevance based on recruiter requirements.

---

### Real-Time Communication

#### Chat System

- One-to-One Messaging
- Real-Time Message Delivery
- Conversation History

#### Voice Calling

- Browser-Based Voice Calls
- Peer-to-Peer Communication

#### Video Calling

- Real-Time Video Communication
- WebRTC-Based Infrastructure

---

### Notification System

- Application Updates
- Hiring Status Notifications
- Connection Notifications
- Message Notifications
- Platform Updates

---

### Subscription Management

- Subscription Plans
- Premium Features
- Payment Processing
- Subscription Tracking

---

### Administration

- User Management
- Company Moderation
- Content Moderation
- Report Handling
- Platform Monitoring

---

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Databases

- MongoDB
- PostgreSQL

### Caching

- Redis

### Messaging

- RabbitMQ

### Search

- Elasticsearch

### Real-Time Communication

- Socket.IO
- WebRTC

### AI Integration

- OpenAI API

### Media Storage

- Cloudinary

### Infrastructure

- Docker
- Docker Compose
- Cloudflare

### Deployment

- EzerHost VPS

---

## Database Design

The platform follows a distributed database architecture.

### Core Entities

- Users
- User Details
- Companies
- Job Posts
- Job Applications
- Posts
- Conversations
- Chats
- Reports
- Notifications
- Subscriptions
- Subscription Types
- Resumes

### Relationships

- Users can create multiple posts.
- Users can apply to multiple jobs.
- Companies can publish multiple jobs.
- Recruiters can manage applicants.
- Users can participate in conversations.
- Users can maintain professional connections.
- Subscription plans determine premium platform access.

---

## Scalability Features

### Redis Caching

Used for:

- User Data Caching
- Frequently Accessed Information
- Performance Optimization

### RabbitMQ

Used for:

- Notification Processing
- Service Communication
- Background Tasks

### Elasticsearch

Used for:

- Efficient Search Operations
- Fast Job Discovery
- Improved Query Performance

### Microservices Architecture

Enables:

- Independent Service Scaling
- Better Maintainability
- Improved Fault Isolation
- Faster Development Cycles

---

## Security Considerations

- JWT-Based Authentication
- Role-Based Access Control
- API Gateway Protection
- Secure Password Storage
- Service Isolation
- Controlled Internal Communication
- Cloudflare Security Layer
- Input Validation
- Protected Service Endpoints

---

## Deployment Architecture

### Production Environment

```text
Users
   │
   ▼
Cloudflare
   │
   ▼
API Gateway
   │
   ├── User Service
   ├── Company Service
   ├── Job Service
   ├── Resume Service
   ├── AI Service
   ├── Chat Service
   ├── Notification Service
   ├── Subscription Service
   ├── Post Service
   ├── Report Service
   └── Admin Service
```

All services are containerized using Docker and deployed on a VPS infrastructure.

---

## Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd careerlink
```

### Environment Variables

Create a `.env` file for each service.

```env
PORT=
MONGO_URI=
POSTGRES_URI=
JWT_SECRET=
REDIS_URL=
RABBITMQ_URL=
ELASTICSEARCH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENAI_API_KEY=
```

### Run Using Docker

```bash
docker compose up --build
```

### Stop Containers

```bash
docker compose down
```

---

## Engineering Challenges

During development, several architectural challenges were addressed:

- Designing a scalable microservices ecosystem
- Managing service-to-service communication
- Building a real-time messaging architecture
- Implementing WebRTC-based calling
- Maintaining data consistency across services
- Integrating AI-generated content workflows
- Optimizing performance using Redis caching
- Building a distributed notification system
- Managing containerized deployments

---

## Key Learnings

This project provided hands-on experience with:

- Microservices Architecture
- Distributed Systems Design
- Event-Driven Architecture
- Real-Time Communication Systems
- Docker-Based Deployment
- API Gateway Patterns
- Database Design
- Search Engine Integration
- Caching Strategies
- AI Integration in Production Applications

---

## Future Enhancements

- Kubernetes Orchestration
- CI/CD Pipelines
- Advanced Recommendation System
- AI Job Matching
- Real-Time Presence Tracking
- Interview Scheduling System
- Analytics Dashboard
- Multi-Region Deployment
- Observability & Monitoring Stack
- Distributed Tracing

---

## Project Goal

CareerLink was built to explore and implement production-grade software engineering concepts including:

- Scalable System Design
- Microservices Architecture
- Distributed Databases
- Event-Driven Communication
- Real-Time Applications
- AI-Powered Workflows

while solving real-world challenges faced by job seekers and recruiters in modern hiring ecosystems.
