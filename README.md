# Personalized Blogging System

A web-based blogging application that allows users to create, view, edit, and delete blog posts. The application uses a Node.js and Express backend, MongoDB for data storage, and HTML, CSS, and JavaScript for the frontend.

## Features

- View blog posts stored in MongoDB.
- Create new blog posts with a title, author, content, and optional banner image.
- Edit existing blog posts.
- Delete blog posts.
- Upload and display blog images.
- Use a dedicated editor page to manage blog content.
- Access blog data through REST API endpoints.

## Technology Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- Mongoose
- Multer for image uploads

**Database**
- MongoDB

## Project Structure

```text
blogging-site-master/
├── public/
│   ├── css/
│   ├── img/
│   ├── js/
│   ├── uploads/
│   ├── home.html
│   ├── blog.html
│   └── editor.html
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB Community Server
- Git (optional, for version control)

## Installation and Setup

### 1. Clone the repository

After this project has been published to GitHub, clone it using:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_NAME
```

Alternatively, open the project folder directly if you already have the source code.

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

This project is configured to connect to MongoDB at:

```text
mongodb://127.0.0.1:27018/blogDB
```

Make sure MongoDB is running on port `27018` before starting the application.

For a manual local setup on Windows, create a database directory and run:

```powershell
New-Item -ItemType Directory -Force -Path D:\data\blogdb
mongod --port 27018 --dbpath "D:\data\blogdb"
```

Keep the MongoDB terminal open.

### 4. Start the application

Open a second terminal in the project directory and run:

```bash
npm start
```

If the `start` script has not been configured yet, run:

```bash
node server.js
```

When the server starts successfully, open:

- Home page: http://localhost:5000/
- Blog page: http://localhost:5000/blog
- Blog editor: http://localhost:5000/editor
- Blog API: http://localhost:5000/api/blogs

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blogs` | Retrieve all blog posts |
| GET | `/api/blogs/:id` | Retrieve a blog post by ID |
| POST | `/api/blogs` | Create a blog post |
| PUT | `/api/blogs/:id` | Update a blog post |
| DELETE | `/api/blogs/:id` | Delete a blog post |
| POST | `/upload` | Upload a blog image |

## Database

The application stores blog posts in the `blogDB` MongoDB database. Blog records include fields such as title, content, author, banner image, publication date, and creation date.

## Future Enhancements

- Improve blog navigation and the Read More experience.
- Add user authentication and authorization.
- Add search, categories, and pagination.
- Improve input validation and error handling.
- Deploy the application to a hosting platform.

## License

This project is available for educational and portfolio purposes. Add a specific open-source license if you intend to distribute it under one.