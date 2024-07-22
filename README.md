# twitter-clone

## Overview

This guide provides instructions for setting up and running the application, including Redis, which is required for the application's background processing.

## Prerequisites

Before setting up the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/get-started)

## 1. Setting Up Redis with Docker

You can run Redis in a Docker container. Follow these steps to set it up:

### Start Redis Container

1. Open your terminal.
2. Run the following command to start a Redis container:

   ```bash
   docker run --name redis -p 6379:6379 -d redis
   docker ps #to check if the Redis container is running
   ```

## 2. Clone the Repository

Clone the repository to your local machine:

```
git clone https://github.com/madzonga/twitter-clone.git
cd twitter-clone
```

## 3. Install Dependencies

```npm install```

## 4. Environment Configuration

```
JWT_SECRET=your_jwt_secret
PORT=3000
REDIS_PORT=6379
REDIS_HOST=localhost
```

## 5. Running the Application

Start the Application
- ```npm start```

Testing
- ```npm test```

- POSTMAN collection ```Twitter Clone API.postman_collection.json``` is in the repository. 

## 6. Stopping Redis Container

```
docker stop redis
docker rm redis
```

Troubleshooting

- Redis is not running: Ensure Docker is running and that the Redis container is up. Use docker ps to verify the container is active.
- Cannot connect to Redis: Check if Redis is accessible at localhost:6379. Ensure no firewall or network issues are blocking the connection.

## 7. Future features to look forward to

- Multimedia Support: Allow users to upload and share multimedia content such as images, videos, and GIFs with integrated previews.
- Direct Messaging: Add a private messaging feature allowing users to communicate directly with each other.
- Personalized Feed Algorithm: Implement a machine-learning-based feed algorithm that tailors content to individual users based on their interests, behavior, and connections.
