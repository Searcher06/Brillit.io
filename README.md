# Brillit: Your Personalized Educational Video Platform 📚

Brillit is a modern, full-stack educational video platform designed to provide a highly personalized learning experience. Leveraging cutting-edge technologies like a high-performance search engine (Typesense) and advanced AI for content suggestions (Google Gemini), Brillit helps users effortlessly discover and engage with educational content tailored to their unique interests and learning history.

---

## ✨ Key Features

*   **Personalized Video Recommendations:** Utilizes Google Gemini AI to analyze user watch history and interests, providing highly relevant educational video suggestions.
*   **Blazing Fast Search:** Implements Typesense for lightning-quick, typo-tolerant search across a vast library of educational videos, ensuring users find exactly what they need, fast.
*   **Intuitive User Interface:** A clean and responsive React frontend delivers a seamless browsing and viewing experience.
*   **Robust User Authentication:** Secure sign-up, sign-in, and profile management with JWT-based authentication.
*   **Dynamic Profile Updates:** Users can update their personal information and profile pictures, stored securely on Cloudinary.
*   **Comprehensive Video Playback:** Seamless integration with YouTube for direct video streaming within the platform.
*   **Scalable Backend Architecture:** Built with Node.js and Express, connected to MongoDB for flexible data storage.

---

## 🛠 Technologies Used

| Category         | Technology                 | Description                                    |
| :--------------- | :------------------------- | :--------------------------------------------- |
| **Frontend**     | React 19                   | Building interactive user interfaces           |
|                  | Vite                       | Fast frontend build tool                       |
|                  | Tailwind CSS               | Utility-first CSS framework for rapid styling  |
|                  | React Router DOM           | Declarative routing for React                  |
|                  | Axios                      | Promise-based HTTP client for API requests     |
|                  | React Player               | Universal React component for playing media URLs |
| **Backend**      | Node.js                    | JavaScript runtime environment                 |
|                  | Express.js                 | Fast, unopinionated web framework              |
|                  | MongoDB                    | NoSQL document database                        |
|                  | Mongoose                   | MongoDB object data modeling (ODM) for Node.js |
|                  | Typesense                  | Open-source, typo-tolerant search engine       |
|                  | Google Gemini AI           | Advanced AI for content suggestions            |
|                  | Cloudinary                 | Cloud-based image and video management         |
| **Authentication** | JSON Web Tokens (JWT)      | Secure user session management                 |
|                  | Bcryptjs                   | Password hashing library                       |
| **Utilities**    | Multer                     | Node.js middleware for handling `multipart/form-data` |
|                  | Cookie-parser              | Parse Cookie header and populate `req.cookies` |
|                  | Dotenv                     | Loads environment variables from a `.env` file |
|                  | CORS                       | Node.js package for providing a Connect/Express middleware |

---

## 🚀 Getting Started

Follow these steps to set up and run Brillit locally on your machine.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Searcher06/Brillit.io.git
    cd Brillit.io
    ```

2.  **Install Frontend Dependencies**
    Navigate to the `client` directory and install the required packages:
    ```bash
    cd client
    npm install
    ```

3.  **Install Backend Dependencies**
    Navigate back to the root directory, then into the `server` directory and install its dependencies:
    ```bash
    cd ../server
    npm install
    ```

### Environment Variables

Before running the application, you'll need to set up environment variables for both the client and server.

#### Server-side (`server/.env`)

Create a `.env` file in the `server` directory and populate it with the following:

```env
PORT=8000
DATABASE_URI="YOUR_MONGODB_CONNECTION_STRING"
JWT_SECRET="YOUR_VERY_STRONG_JWT_SECRET"
CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
TYPESENSE_ENV="YOUR_TYPESENSE_ENVIRONMENT" # e.g., 'local' or 'cloud'
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
API_KEY="YOUR_YOUTUBE_DATA_API_KEY" # For YouTube video data fetching
NODE_ENV="development" # or 'production'
```

*   **MongoDB:** Obtain a connection string from MongoDB Atlas or set up a local MongoDB instance.
*   **Cloudinary:** Sign up for a Cloudinary account to get your cloud name, API key, and API secret.
*   **Typesense:**
    *   For local Typesense, ensure your Typesense server is running (e.g., using Docker).
    *   If using Typesense Cloud, refer to their documentation for `host`, `port`, `protocol`, and `apiKey` for your client configuration (though the current `typesenseClient.js` defaults to `localhost`).
*   **Google Gemini:** Get an API key from Google AI Studio.
*   **YouTube Data API:** Enable the YouTube Data API v3 in your Google Cloud Project and obtain an API key.

### Running the Application

1.  **Start the Backend Server**
    From the `server` directory:
    ```bash
    npm run dev
    ```
    This will start the backend server, typically on `http://localhost:8000`. It will also attempt to connect to MongoDB and set up/seed the Typesense collection.

2.  **Start the Frontend Development Server**
    From the `client` directory:
    ```bash
    npm run dev
    ```
    This will start the React development server, usually on `http://localhost:5173`.

---

## 💻 Usage

Once both the backend and frontend servers are running, open your web browser and navigate to `http://localhost:5173`.

*   **Sign Up/Login:** Create a new account or log in with existing credentials.
*   **Personalize Interests:** Upon first login, or if `isPersonalized` is false, you'll be prompted to select topics of interest. This initial personalization feeds the AI recommendation engine.
*   **Browse & Search:** Explore recommended videos on the homepage or use the search bar to find specific educational content. The search is powered by Typesense for fast, relevant results.
*   **Watch Videos:** Click on any video thumbnail to open the video player page. The platform integrates directly with YouTube for playback.
*   **Profile Management:** Access your profile to update your name, password, or profile picture.
*   **SynthAi Chatbot:** While the provided `Chatbot.jsx` offers a static UI example, the backend is equipped to process AI suggestions based on your watched videos to continually refine your content feed.

---

# Brillit.io Backend API

## Overview
The Brillit.io backend is an API server built with Node.js and the Express framework. It manages user authentication, handles video content search and recommendations, integrates with external services like YouTube Data API, Google Gemini AI for personalization, and Cloudinary for media uploads, all while utilizing MongoDB as its primary data store and Typesense for fast, relevant search capabilities.

## Features
- **Node.js**: Asynchronous event-driven JavaScript runtime.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for flexible and scalable data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Typesense**: High-performance, open-source search engine for fast, typo-tolerant search.
- **Google Gemini AI**: Provides intelligent content recommendations and personalization based on user activity.
- **Cloudinary**: Cloud-based media management for storing user profile pictures.
- **JWT**: JSON Web Tokens for secure and stateless authentication.
- **Bcryptjs**: For secure password hashing.
- **Multer**: Middleware for handling `multipart/form-data`, primarily for file uploads.

## Getting Started
### Installation
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

### Environment Variables
All required environment variables are listed below. Create a `.env` file in the `server` directory and set these values.
- `PORT`: The port on which the server will run (e.g., `8000`).
- `DATABASE_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/brillit_db` or MongoDB Atlas URI).
- `JWT_SECRET`: A secret key for signing and verifying JWTs (e.g., `supersecretjwtkey`).
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
- `TYPESENSE_ENV`: Indicates Typesense environment (`cloud` or `local`).
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `API_KEY`: Your YouTube Data API v3 key.
- `NODE_ENV`: Application environment (`development` or `production`).

## API Documentation
### Base URL
`http://localhost:8000/api/v1`

### Endpoints

#### `POST /api/v1/users/sign-up`
**Description**: Registers a new user account.
**Request**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "_id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```
**Errors**:
- `400 Bad Request`: "Please add all fields", "No whitespaces allowed for Firstname and Lastname", "Please enter a valid email", "User already exists", "Firstname must be atleast 3 characters length", "Lastname must be atleast 3 characters length", "Password must be atleast 6 characters length", "Use of special characters is not allowed for Firstname and Lastname", "Invalid user data".

#### `POST /api/v1/users/sign-in`
**Description**: Authenticates a user and sets a JWT cookie.
**Request**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "_id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "profilePic": "string",
  "suggestedKeywords": ["string"],
  "isPersonalized": "boolean",
  "isVerified": "boolean",
  "videosWatched": ["string"],
  "createdAt": "date-time"
}
```
**Errors**:
- `400 Bad Request`: "Please add all fields", "Invalid user credentials".

#### `POST /api/v1/users/sign-out`
**Description**: Logs out the current user by clearing the JWT cookie.
**Request**: (No body)
**Response**:
```json
{
  "message": "Logged out"
}
```
**Errors**:
- (None explicitly defined in controller, handled by error middleware)

#### `GET /api/v1/users/me`
**Description**: Retrieves the profile information of the authenticated user.
**Request**: (No body)
**Response**:
```json
{
  "_id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "profilePic": "string",
  "suggestedKeywords": ["string"],
  "isPersonalized": "boolean",
  "isVerified": "boolean",
  "videosWatched": ["string"],
  "createdAt": "date-time"
}
```
**Errors**:
- `401 Unauthorized`: "Not authorized, no token", "Invalid token: no user ID", "Not authorized, token failed".

#### `PUT /api/v1/users/updateProfile`
**Description**: Updates the authenticated user's profile information, including names, password, and profile picture.
**Request**: (multipart/form-data)
```
Form Data:
  newFirstName: "string" (optional)
  newLastName: "string" (optional)
  oldPassword: "string" (required if newPassword is provided)
  newPassword: "string" (optional)
  image: "file" (optional, for profile picture upload)
```
**Response**:
```json
{
  "_id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "profilePic": "string",
  "suggestedKeywords": ["string"],
  "isPersonalized": "boolean",
  "isVerified": "boolean",
  "videosWatched": ["string"],
  "createdAt": "date-time"
}
```
**Errors**:
- `404 Not Found`: "User not found".
- `400 Bad Request`: "Firstname must be at least 3 characters", "Lastname must be at least 3 characters", "Firstname is too long (25 max)", "Lastname is too long (25 max)", "Special characters are not allowed in names", "Please fill in the old password", "Old password is incorrect", "Password must be at least 6 characters".
- `500 Internal Server Error`: "Network error. Try again", "Network issue. Please check your connection and try again", "Internal server error".

#### `GET /api/v1/videos/search`
**Description**: Searches for educational videos based on a query using Typesense, and falls back to YouTube API if results are insufficient.
**Request**: (Query Parameters)
`q`: "string" (search query)
**Response**:
```json
[
  {
    "youtubeId": "string",
    "title": "string",
    "description": "string",
    "channelTitle": "string",
    "channelId": "string",
    "thumbnails": {
      "default": "string",
      "medium": "string",
      "high": "string"
    },
    "tags": ["string"],
    "category": "string",
    "publishedAt": "date-time",
    "duration": "string",
    "viewCount": "number",
    "likeCount": "number",
    "favoriteCount": "number",
    "commentCount": "number",
    "searchTerms": ["string"],
    "curated": "boolean",
    "addedBySearch": "boolean",
    "createdAt": "date-time"
  }
]
```
**Errors**:
- `400 Bad Request`: "Empty search query".
- `500 Internal Server Error`: "Error in search" (general error).

#### `GET /api/v1/videos/:id`
**Description**: Retrieves details for a specific video and related videos from the same channel and recommended videos based on user's search query. It also updates the user's watched video history.
**Request**: (URL Parameters)
`id`: "string" (YouTube video ID)
`q`: "string" (query for recommended videos, optional)
**Response**:
```json
{
  "channelVideos": {
    "kind": "string",
    "etag": "string",
    "nextPageToken": "string",
    "regionCode": "string",
    "pageInfo": {
      "totalResults": "number",
      "resultsPerPage": "number"
    },
    "items": [
      {
        "kind": "string",
        "etag": "string",
        "id": {
          "kind": "string",
          "videoId": "string"
        },
        "snippet": { /* YouTube Snippet details */ },
        "contentDetails": { /* YouTube Content Details */ }
      }
    ]
  },
  "recommendedVideos": [
    {
      "youtubeId": "string",
      "title": "string",
      "description": "string",
      "channelTitle": "string",
      "channelId": "string",
      "thumbnails": {
        "default": "string",
        "medium": "string",
        "high": "string"
      },
      "tags": ["string"],
      "category": "string",
      "publishedAt": "date-time",
      "duration": "string",
      "viewCount": "number",
      "likeCount": "number",
      "favoriteCount": "number",
      "commentCount": "number",
      "searchTerms": ["string"],
      "curated": "boolean",
      "addedBySearch": "boolean",
      "createdAt": "date-time"
    }
  ]
}
```
**Errors**:
- `404 Not Found`: "Video not found".
- `500 Internal Error`: "Internal error".

#### `POST /api/v1/ai/suggest`
**Description**: Generates personalized educational keywords for a new user based on their initial interests.
**Request**:
```json
{
  "message": "string"
}
```
**Response**:
```json
["keyword1", "keyword2", "keyword3", ...]
```
**Errors**:
- `400 Bad Request`: "Message is required".
- `503 Service Unavailable`: "Too many request at the moment try again later".
- `500 Internal Server Error`: "Gemini gave no usable text", "Internal server error".

#### `POST /api/v1/ai/videoSuggestion`
**Description**: Updates user's suggested keywords based on their current video watch history.
**Request**: (No body)
**Response**:
```json
["keyword1", "keyword2", "keyword3", ...]
```
**Errors**:
- `503 Service Unavailable`: "Too many request at the moment try again later".
- `500 Internal Server Error`: "Gemini gave no usable text", "Internal server error".

#### `GET /api/v1/dashboard`
**Description**: A protected route that displays a welcome message to the authenticated user.
**Request**: (No body, requires authentication)
**Response**:
```json
{
  "message": "Welcome  [User's First Name]"
}
```
**Errors**:
- `401 Unauthorized`: "Not authorized, no token", "Invalid token: no user ID", "Not authorized, token failed".

#### `GET /api/v1/special`
**Description**: Exports all documents from the Typesense 'videos' collection.
**Request**: (No body)
**Response**:
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "url": "string",
    "channel": "string",
    "tags": ["string"],
    "views": "number",
    "createdAt": "number",
    "publishedAt": "number"
  }
]
```
**Errors**:
- `500 Internal Server Error`: "Error in getting docs".

#### `GET /api/v1/getAll`
**Description**: Retrieves all video documents from the MongoDB database.
**Request**: (No body)
**Response**:
```json
[
  {
    "_id": "string",
    "youtubeId": "string",
    "title": "string",
    "description": "string",
    "channelTitle": "string",
    "channelId": "string",
    "thumbnails": {
      "default": "string",
      "medium": "string",
      "high": "string"
    },
    "tags": ["string"],
    "category": "string",
    "publishedAt": "date-time",
    "duration": "string",
    "viewCount": "number",
    "likeCount": "number",
    "favoriteCount": "number",
    "commentCount": "number",
    "searchTerms": ["string"],
    "curated": "boolean",
    "addedBySearch": "boolean",
    "createdAt": "date-time"
  }
]
```
**Errors**:
- `500 Internal Server Error`: "Error in getting all videos from DB".

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve Brillit, please follow these guidelines:

*   **Fork the Repository:** Start by forking the project to your GitHub account.
*   **Create a New Branch:** Make a new branch for your feature or bug fix (e.g., `feat/add-new-search-filter` or `fix/auth-bug`).
*   **Develop & Test:** Implement your changes and ensure all existing tests pass, and new tests cover your additions.
*   **Commit Your Changes:** Write clear, concise commit messages.
*   **Open a Pull Request:** Submit a pull request to the `main` branch of this repository, describing your changes and their benefits.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✍️ Author Info

*   **Your Name:** Ahmad Ibrahim
*   **LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/yourusername)
*   **Twitter:** [Your Twitter Handle](https://twitter.com/yourhandle)
*   **Portfolio/Website:** [Your Personal Website](https://yourwebsite.com)

---

## 🏅 Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x-green.svg)](https://www.mongodb.com/)
[![Typesense](https://img.shields.io/badge/Typesense-2.x-orange.svg)](https://typesense.org/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-API-blueviolet.svg)](https://ai.google.dev/models/gemini)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Integration-darkgreen.svg)](https://cloudinary.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://prettier.io)
[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)