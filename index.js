const express = require("express");
const { v4: uuidv4 } = require("uuid");
//const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
const cors = require("cors");
const app = express();

let tasks = [
  {
    id: "0c3aea71-6d17-4a0e-ac37-8a0175f790b1",
    name: "elvergalarwerwerwergrraff34343434FGFGFDFDFDFGDFDFFG",
    email: "xxxxxxxx@hotmail.com34343RTRTRT4",
    phone: "QUE CALOR2",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>ToDo List</h1>");
});

app.get("/api/tasks", (request, response) => {
  response.json(tasks);
});

app.use((req, res, next) => {
  next({
    statusCode: 404,
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Error" } = err;
  console.log(message);
  res.status(statusCode);
  res.json({
    message,
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
