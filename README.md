# SamparkCircle

**SamparkCircle** is a platform that connects NGOs, volunteers, and donors to streamline fundraising, event management, and volunteer recruitment. It provides a unified, dark-themed interface with real-time features and secure payment integration to support social causes efficiently.

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Architecture & Tech Stack](#architecture--tech-stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running Locally](#running-locally)  
5. [API Endpoints](#api-endpoints)  
6. [Roles & Permissions](#roles--permissions)  
7. [Testing](#testing)  
8. [Deployment](#deployment)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Contact](#contact)  

---

## Project Overview
SamparkCircle aims to empower NGOs by providing tools to:
- Launch and manage fundraising campaigns  
- Recruit and manage volunteers  
- Accept secure online donations  
- Engage donors and volunteers with real-time updates and insights  

Whether you’re an NGO looking for digital support or an individual eager to contribute, SamparkCircle makes collaboration simple and transparent.

---

## Features
- **Fundraiser Management**: Create, edit, list, and manage campaigns tied to NGO profiles.  
- **Secure Payments**: Integrated with Razorpay and Stripe for seamless donations.  
- **Volunteer Portal**: NGOs can post opportunities; volunteers can browse and apply.  
- **Real-Time Notifications**: Live updates on campaign milestones, applications, and messages.  
- **AI Chatbot**: Built with OpenAI/Rasa for answering user queries and guiding them.  
- **Donation Insights & Fraud Detection**: Analytics dashboards and heuristic checks to ensure trust.  
- **Role-Based Access Control**: Distinct permissions for NGOs, volunteers, and donors using JWT & OAuth.  
- **Accessibility & Theming**: Dark mode support and WCAG-compliant components.  
- **CI/CD & Deployment**: Automatic builds and deployments via GitHub Actions to Vercel (frontend) and Heroku/Netlify (backend).  

---

## Architecture & Tech Stack
- **Frontend**: React.js, TailwindCSS, Redux Toolkit / React Query, Axios  
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT & OAuth2.0  
- **Services**:  
  - Payment: Razorpay, Stripe  
  - Real-time: Socket.io / Firebase Realtime Database  
  - AI: OpenAI API / Rasa  
- **Testing**: Jest, Supertest (backend), React Testing Library (frontend)  
- **DevOps**: GitHub Actions, Docker (optional), Vercel / Netlify, Heroku  

---

## Getting Started

### Prerequisites
- Node.js (>= 16.x) & npm or Yarn  
- MongoDB instance (local or Atlas)  

### Installation
1. **Clone the repository**  
   ```bash
   git clone https://github.com/<your-org>/SamparkCircle.git
   cd SamparkCircle

STRIPE_SECRET_KEY=<stripe-secret-key>
