const http = require("http");

const port = Number(process.env.PORT ?? 3000);

const tasks = [
    { id: 1, title: "Learn Git" },
    { id: 2, title: "lalala" },
];

let nextTaskId = 3;

const server = http.createServer((request, response) => {
    console.log(`${request.method} ${request.url}`);

    const url = new URL(request.url, `http://${request.headers.host}`);

    /* console.log(url.pathname);
    console.log(url.searchParams.get("search")); */

    response.setHeader("Content-type", "application/json");

    if(request.method === "GET" && request.url === "/") {
        response.statusCode = 200;
        response.end(
            JSON.stringify({
                message: "Hello after merge conflict",
            }),
        );
        return;
    }

    if(request.method === "GET" && url.pathname === "/tasks") {

        const search = url.searchParams.get("search");
        if(!search) {
            response.end(
                JSON.stringify({tasks})
            );
            return;
        }
        response.statusCode = 200;

        const filteredTasks = tasks.filter((item) => {
            return item.title.toLowerCase().includes(search.toLowerCase());
        })
        response.end(
            JSON.stringify({tasks: filteredTasks})
        );
        return;
    }

    if(request.method === "GET" && request.url === "/health") {
        response.statusCode = 200;
        response.end(
            JSON.stringify({
                "status": "ok",
            })
        )
        return;
    }

    if(request.method === "GET" && request.url.startsWith("/tasks/")) {
        const parts = request.url.split("/");

        if(parts.length !== 3) {
            response.statusCode = 400;
            response.end(
                JSON.stringify({
                    error: "invalid task url",
                }),
            );
            return;
        }

        const idText = parts[2];
        const id = Number(idText);

        if(!Number.isInteger(id) || id <= 0) {
            response.statusCode = 400;
            response.end(
                JSON.stringify({
                    error: "invalid task url",
                }),
            );
            return;
        }

        const task = tasks.find((item) => item.id === id);

        if(!task) {
            response.statusCode = 404;
            response.end(
                JSON.stringify({
                    error: "task not exist",
                }),
            )
            return;
        } 

        response.statusCode = 200;
        response.end(
        JSON.stringify({
                task,
            })
        );
        return;
    }

    if(request.method === "POST" && request.url === "/tasks") {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        request.on("end", () => {
            try{
                const data = JSON.parse(body);

                if(typeof data.title !== "string" || data.title.trim() === "") {
                    response.statusCode = 400;
                    response.end(
                        JSON.stringify({
                            error: "title is required",
                        }),
                    );
                    return;
                }

                const newTask = {
                    id: nextTaskId,
                    title: data.title.trim(),
                };

                nextTaskId += 1;

                tasks.push(newTask);

                response.statusCode = 201;
                response.end(JSON.stringify(newTask));
            } catch(error) {
                response.statusCode = 400;
                response.end(
                    JSON.stringify({
                        error: "invalid JSON",
                    }),
                );
            }
        });
        return;
    }

    if(request.method === "PATCH" && request.url.startsWith("/tasks/")) {
        const parts = request.url.split("/");

        let body = "";

        if(parts.length !== 3) {
            response.statusCode = 400;
            response.end(
                JSON.stringify({
                    error: "invalid task url",
                }),
            );
            return;
        }

        const id = Number(parts[2]);

        if(!Number.isInteger(id) || id <= 0) {
            response.statusCode = 400;
            response.end(
                JSON.stringify({
                    error: "invalid task id",
                }),
            );
            return;
        }

        const task = tasks.find((item) => item.id === id);

        if(!task) {
            response.statusCode = 404;
            response.end(
                JSON.stringify({
                    error: "task not found",
                }),
            );
            return;
        }

        request.on("data", (chunk) => {
            body += chunk.toString();
        });

        request.on("end", () => {
            try{
                const data = JSON.parse(body);

                if(typeof data.title === "string" && data.title.trim() !== "") {
                    task.title = data.title.trim();
                } else {
                    response.statusCode = 400;
                    response.end(
                        JSON.stringify({
                            error: "title is required",
                        }),
                    );
                    return;
                }

                response.statusCode = 200;
                response.end(
                    JSON.stringify({
                        task: {
                            id: task.id,
                            title: task.title,
                        },
                    }),
                );
            
            } catch (error) {
                response.statusCode = 400;
                response.end(
                    JSON.stringify({
                        error: "invalid json",
                    }),
                );
            }
        })
        return;

    }

    if(request.method === "DELETE" && request.url.startsWith("/tasks/")) {
        const parts = request.url.split("/");

        if(parts.length !== 3) {
            response.statusCode = 400;
            response.end(
                JSON.stringify({
                    error: "invalid task url",
                }),
            );
            return;
        }

        const id = Number(parts[2]);

        if(!Number.isInteger(id) || id <= 0) {
            response.statusCode = 400;
            response.end(
                JSON.stringify({
                    error: "invalid task id",
                }),
            );
            return;
        }

        const taskIndex = tasks.findIndex((item) => item.id === id);

        if(taskIndex === -1) {
            response.statusCode = 404;
            response.end(
                JSON.stringify({
                    error: "task not found",
                }),
            );
            return;
        }

        tasks.splice(taskIndex, 1);

        response.statusCode = 204;
        response.end()
        return;
    }

    response.statusCode = 404;
    response.end(
        JSON.stringify({
            error: "not found",
        })
    )
});

server.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`)
});
