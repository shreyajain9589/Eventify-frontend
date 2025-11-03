# Eventify — Frontend

Eventify is a full-stack event booking web application. This is the **frontend** built with React.js, Tailwind CSS, and Framer Motion. Users can browse events, register/login, and book events in real time.

## Features

- User registration and login with JWT authentication.
- Browse available events and book seats in real time.
- Real-time updates of events using Socket.IO.
- Responsive and interactive UI with animations using Framer Motion.
- QR code generation for booking confirmation (simulated payment).

## Tech Stack

- React.js
- Tailwind CSS
- Framer Motion
- Socket.IO (for real-time updates)
- JWT (for authentication)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shreyajain9589/Eventify-frontend.git
2. Navigate into the project directory:
cd Eventify-frontend

3. Install dependencies:
npm install

4.Start the development server:
npm start

Configuration
Create a .env file in the root directory.

Add the backend API URL, for example:
REACT_APP_API_URL=http://localhost:5000

Usage
Open the app in a browser.
Register or login as a user to book events.
Admin users can manage events via the admin dashboard (requires backend API)
