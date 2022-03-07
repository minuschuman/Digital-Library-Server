const http = require("http");

const hostname = "localhost";
const port = process.env.LOCAL_ADDRESS || 5000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// const { PORT = 5000, LOCAL_ADDRESS = "0.0.0.0 || 127.0.0.1" } = process.env;
// server.listen(PORT, LOCAL_ADDRESS, () => {
//   const address = server.address();
//   console.log("server listening at", address);
// });
