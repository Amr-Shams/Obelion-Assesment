
# Obelion Assessment

## Overview
This project is a TypeScript application with Docker support, designed to be deployed on [Railway](https://obelion.up.railway.app).

## Technologies Used
- TypeScript
- Docker
- Docker Compose
- Node.js
- Swagger (for API documentation)
- Railway (for deployment)

## Pre-run Setup
Before running the application, create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

Ensure the environment variables are correctly configured for the application to run smoothly.

## Setup Instructions

### Using Docker and Docker Compose

1. **Install Docker & Docker Compose:**
   Ensure both Docker and Docker Compose are installed. You can download Docker Desktop, which includes Docker Compose, from [here](https://www.docker.com/products/docker-desktop).

2. **Clone the Repository:**
   Clone the project repository:
   ```sh
   git clone https://github.com/Amr-Shams/Obelion-Assesment.git
   cd Obelion-Assesment
   ```

3. **Configure Environment Variables:**
   Make sure to create the `.env` file as described in the **Pre-run Setup** section above. **the db host is the name of the image(db)**
4. **Build and Run with Docker Compose:**
   Run the following command to build the image and start the application:
   ```sh
   docker-compose up --build
   ```
   
   This command will build the necessary Docker images and start the application in a container.

5. **Access the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

6. **Stopping the Application:**
   To stop the containers, run:
   ```sh
   docker-compose down
   ```

### Using Local Environment (Without Docker)

1. **Install Node.js:**
   Ensure Node.js is installed on your system. You can download Node.js from [here](https://nodejs.org/).

2. **Clone the Repository:**
   ```sh
   git clone https://github.com/Amr-Shams/Obelion-Assesment.git
   cd Obelion-Assesment
   ```

3. **Install Dependencies:**
   Install the necessary dependencies:
   ```sh
   npm install
   ```

4. **Run the Application:**
   Start the application locally:
   ```sh
   npm start
   ```

5. **Access the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

### Running Tests

To run the test suite locally, use the following command:
```sh
npm test
```

This will execute the test cases defined in the project.

## Deployment on Railway

The application is already deployed and accessible at:
[obelion.up.railway.app](https://obelion.up.railway.app)
**Note:** The application is deployed on a free tier, so it may take some time to load initially.
*API Documentation is available at [obelion.up.railway.app/api-docs](https://obelion.up.railway.app/api-docs)*
## License
This project is licensed under the MIT License. You can review the terms of the license [here](LICENSE).

---

### Additional Tips:

- **Ensure `.env` File Security:**
   Never commit your `.env` file to version control. Use a `.gitignore` file to exclude it from commits:
   ```sh
   echo ".env" >> .gitignore
   ```

- **Docker Compose for Multiple Services:**
   If your project grows and requires multiple services (e.g., databases), you can easily extend `docker-compose.yml` by adding more service definitions.

- **Rebuilding Containers:**
   If you make changes to the Dockerfile or `docker-compose.yml`, you can rebuild the containers using:
   ```sh
   docker-compose up --build
   ```

- **Logs and Debugging:**
   To view logs from the running containers, use:
   ```sh
   docker-compose logs -f
   ```

- **Running Tests in CI:**
   You can configure CI/CD tools like GitHub Actions to run `npm test` during the pipeline to ensure code quality before deploying changes.

