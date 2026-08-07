# Local Server Practice

A simple REST API built with Node.js using the native `http` module.

This project is used to practice HTTP, REST APIs, routing, validation, Git, and GitHub workflows.

## Features

- Get all tasks
- Get a task by ID
- Create a task
- Update a task
- Delete a task
- Search tasks by title
- Basic request validation
- HTTP status code handling
- JSON request and response bodies

## Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Home route |
| GET | `/health` | Server health check |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks?search=git` | Search tasks by title |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Run the Server

    PORT=4500 node review-server.js

The server will be available at:

    http://localhost:4500

## Examples

Get all tasks:

    curl http://localhost:4500/tasks

Search tasks:

    curl "http://localhost:4500/tasks?search=git"

Create a task:

    curl http://localhost:4500/tasks \
      -H "Content-Type: application/json" \
      -d '{"title":"Learn REST"}'

Update a task:

    curl -X PATCH http://localhost:4500/tasks/1 \
      -H "Content-Type: application/json" \
      -d '{"title":"Learn HTTP"}'

Delete a task:

    curl -X DELETE http://localhost:4500/tasks/1

## HTTP Status Codes

- `200 OK` — successful request
- `201 Created` — task created
- `204 No Content` — task deleted
- `400 Bad Request` — invalid input
- `404 Not Found` — resource not found

## What I Practiced

- Node.js HTTP server
- HTTP methods
- Request and response handling
- JSON parsing
- Path parameters
- Query parameters
- REST API design
- CRUD operations
- Input validation
- Git branches
- Pull Requests
