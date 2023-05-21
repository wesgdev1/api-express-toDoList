const express = require("express");
const { v4: uuidv4 } = require("uuid");
//const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
const cors = require("cors");
const app = express();

let tasks = [
  {
    id: "0c3aea71-6d17-4a0e-ac37-8a0175f790b1",
    title: "Comprar pan",
    status: "In_progress",
    responsible: "Welinton Suarez",
  },
  {
    id: "0c3aea71-6d17-4a0e-ac37-8a0175f79023",
    title: "Comprar leche",
    status: "To_do",
    responsible: "Eduardo Montejo",
  },
  {
    id: "0c3aea71-6d17-4a0e-ac37-8a0175f79056",
    title: "Comprar aceite",
    status: "Done",
    responsible: "Diana Vergel",
  },
];

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>ToDo List</h1>");
});

app.get("/tasks", (request, response) => {
  response.json(tasks);
});

//GET BY ID
app.get("/tasks/:id", (req, res, next) => {
  const { params = {} } = req;
  const { id = "" } = params;
  const task = tasks.find(function (element) {
    return id === element.id;
  });

  if (task) {
    res.json(task);
  } else {
    next({
      statusCode: 404,
      message: `Note with ${id}, Not Found`,
    });
  }
});

//CREATE
app.post("/tasks", (req, res) => {
  const { body } = req;
  const task = {
    id: uuidv4(),
    ...body,
  };
  tasks.push(task);
  res.status(201).json(task);
});

//UPDATE
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  let taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...body,
  };
  res.json(tasks[taskIndex]);
});

//DELETE
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  let taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  tasks.splice(taskIndex, 1);
  res.sendStatus(204);
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
