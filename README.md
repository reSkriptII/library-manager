# Libman – Library Management System

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-In%20Development-orange)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js-informational)

## Overview

Libman is a full-stack web application for manage essential operations for a modern library. It provides an easy way to browse catalogs and manage loans, while offering secure, role-based dashboards for librarians and administrators to manage inventory and user accounts

## Features

- **Public Access**
  - Searchable book catalog with real-time filtering
  - User dashboard for tracking active loans and due dates
- **Authentication and Authorization**
  - JWT-based authentication system
  - Role-Based Access Control (RBAC) for Admin and Librarian roles
- **Role Feature**
  - Librarian
    - Book borrowing and return workflow
    - Member registration system
  -Admin Functions
    - Full CRUD operations for book inventory
    - User and role management system

## Tech Stack

- PERN (PostgreSQL, Express, React, Node.js)
- Typescript with Deep tissue typing
- use Redis for auth session

## Architecture

using 3 layers architecture (controller, service, model) seperate by feature

## Challenges & Solutions
- Env issue -> solved with Zod validation
- Deployment issues -> now migrating to Docker

## Demo

[Live Demo](https://library-manager-lime.vercel.app/servererror)
Demo Account (for login):
 - role: admin
   email: admin@test.com
   password: admin1234
 - role: librarian
   email: librarian@test.com
   password: librarian1234
 - role: member (account for a common user)
   email: member@test.com
   password: user1234
   
## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
