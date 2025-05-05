# PowerLog Backend

This repository contains the backend code for the PowerLog application.

## Overview

PowerLog is an application designed to track and analyze power usage and related metrics.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- MongoDB (local or remote instance)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific configuration.

4. Start the development server:
   ```
   npm run dev
   ```

## Features

- User authentication and authorization
- Data collection from power sources
- API endpoints for data retrieval and analysis
- Automated reporting

## API Documentation

API documentation is available at `/api/docs` when the server is running.

## License

[MIT](LICENSE)
