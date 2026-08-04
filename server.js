const http = require("http");

const port = Number(process.env.PORT ?? 3000);

const server = http.createServer((request, response) => {
  console.log(`${request.method} ${request.url}`);

  response.setHeader("Content-Type", "application/json");

  if (request.method === "GET" && request.url === "/") {
    response.statusCode = 200;
    response.end(
      JSON.stringify({
        message: "Home page",
      }),
    );
    return;
  }

  if (request.method === "GET" && request.url === "/tasks") {
    response.statusCode = 200;
    response.end(
      JSON.stringify({
        tasks: [
          { id: 1, title: "Learn HTTP" },
          { id: 2, title: "Learn Node.js" },
        ],
      }),
    );
    return;
  }

  response.statusCode = 404;
  response.end(
    JSON.stringify({
      error: "Route not found",
    }),
  );
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});