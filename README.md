# Employee Autocomplete Search

A full-stack application that provides real-time autocomplete suggestions to help users quickly find employees by name or department. The project consists of a React-based frontend and a PHP/MySQL backend.

## Table of Contents

- [Employee Autocomplete Search](#employee-autocomplete-search)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Project Structure](#project-structure)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
      - [Set Up PHP Environment](#set-up-php-environment)
      - [Run via Built-in PHP Server (for development):](#run-via-built-in-php-server-for-development)
      - [Test the API](#test-the-api)
  - [API Endpoint](#api-endpoint)

## Overview

This project demonstrates an employee search tool that leverages autocomplete functionality. Users type in the search box and get dynamic suggestions that are debounced to reduce unnecessary API calls. The backend, built with PHP and PDO, fetches and returns search results from a MySQL database.

---

## Project Structure

```
├── frontend
│   ├── src
│   │   ├── components
│   │   │   └── Autocomplete
│   │   │       ├── Autocomplete.jsx
│   │   │       └── Autocomplete.scss
|   |   |   └── Header
|   |   |       ├── Header.jsx
│   │   │       └── Header.scss
│   │   ├── services
│   │   │   └── dataService.js
│   │   
│   └── package.json
├── backend
│   ├── src
│   │   ├── Controllers
│   │   │   └── Autocomplete.php
│   │   ├── Model
│   │   │   └── AutocompleteModel.php
│   │   ├── Route
│   │   │   └── Autocomplete.php
│   │   ├── Services
│   │   │   └── DatabaseService.php
│   └── config
│   │   └── db.php
│   └── index.php (router)
└── README.md
```

## Features

- **Real-Time Autocomplete:** Search for employees by name or department with live suggestions.
- **Debounced Input:** Waits until the user stops typing before firing a search request.
- **Keyboard Navigation:** Use arrow keys to navigate through suggestions.
- **Error Handling:** Gracefully handles API and database errors.
- **Full Search Option:** A button that triggers a full search for more comprehensive results.

## Technologies

- **Frontend:** React, JavaScript, SCSS
- **Backend:** PHP, PDO, MySQL
- **Others:** Custom fetch service (`fetchAutocomplete`) to handle API calls with robust error handling.

## Installation

### Frontend Setup


1. **Clone the repository:**
   ```bash
   git clone https://github.com/AdirElmaleh/autocomplete.git
   
   cd autocomplete

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm start
   ```
   This starts the React development server. The autocomplete component is located at:
   ```
   src/components/Autocomplete/Autocomplete.jsx
   ```

### Backend Setup

#### Set Up PHP Environment

- Ensure you have **PHP 7.4 or higher** installed.

 **Set up environment variables:**
  1. Create a `.env` file in the root of your backend directory.
  2. Add the following configuration:
     ```ini
     DB_HOST=your_database_host
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     ```



#### Run via Built-in PHP Server (for development):

 ```bash
   cd backend
  ```

```bash
php -S localhost:8000 -t .
```

#### Test the API
You can test the API by navigating to:

```
http://localhost:8000/autocomplete?query=John
```

---

## API Endpoint

- **URL:** `/autocomplete`

- **Method:** `GET`

- **Parameters:**

  - `query` *(string, required)*: The search string (minimum 2 characters).
  - `fullResults` *(boolean, optional)*: If set to `true`, returns a larger number of results.

- **Response:** JSON array of suggestions. Each suggestion includes:

  - `imageUrl`: URL of the employee image.
  - `workTitle`: Employee's department or work title.
  - `name`: Employee's name.

**Example Request:**

```bash
GET /autocomplete?query=John&fullResults=true
```

---
