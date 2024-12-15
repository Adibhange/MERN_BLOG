# MERN Blog Project

A full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js). This project allows users to create accounts, log in, post blogs, edit blogs, delete blogs, and view blogs. Password security is handled using **bcrypt** and **JSON Web Tokens (JWT)**. Cloudinary is used to store and serve images.

## Features

- **User Authentication**
  - Sign up, login, and logout functionality.
  - Password security with **bcrypt** and **JWT** for token-based authentication.
  
- **Blog Management**
  - Create, edit, and delete blogs.
  - View individual blogs with detailed content.

- **Image Upload**
  - Upload and display images with Cloudinary integration.

## Technologies Used

- **Frontend:**
  - React (with **Vite** for faster builds)
  - Vanilla CSS for styling

- **Backend:**
  - Node.js with **Express** for the server
  - MongoDB for data storage (CRUD operations)
  
- **Authentication & Security:**
  - **bcrypt** for password hashing
  - **JWT (JSON Web Tokens)** for secure authentication
  
- **Image Storage:**
  - **Cloudinary** for storing and serving images

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account (for image storage)
