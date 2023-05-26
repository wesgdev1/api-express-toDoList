const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
const cors = require("cors");
const app = express();

let tasks = [
  {
    id: "0c1aea71-6d17-4a0e-ac37-8a0175f866b1",
    task: "Comprar pan",
    assigned: "Pedro suarez",
    state: "in-progress",
  },
  {
    id: "0c2aea71-6d17-4a0e-ac37-8a0175f145b1",
    task: "Comprar leche",
    assigned: "Eduardo Montejo",
    state: "to-do",
  },
  {
    id: "0c0aea71-6d17-4a0e-ac37-8a0175f654b1",
    task: "Comprar arooz",
    assigned: "InKnady higuita",
    state: "done",
  },
];

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Página de inicio
 *     description: Retorna un mensaje de bienvenida
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get("/", (request, response) => {
  response.send("<h1>Proyecto Api para un KanBa - Proyecto Make It Real</h1>");
});

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Obtener todas la tareas
 *     description: Retorna una lista de todos las tareas
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/tasks", (request, response) => {
  response.json(tasks);
});

//GET BY ID

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     description: Retorna una tarea en específico basado en su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
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
/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     description: Crea una nueva tarea con la información proporcionada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
app.post("/tasks", (req, res) => {
  const { body } = req;
  const task = {
    id: uuidv4(),
    ...body,
  };
  tasks.push(task);
  res.status(201).json(task);
});

/**
 * @openapi
 * /tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea existente
 *     description: Actualiza la información de una tarea existente basado en su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */

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

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea correctamente
 *     description: Elimina una tarea existente basado en su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contacto
 *     responses:
 *       204:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error
 */
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//ESQUEMAS PARA SAWWAGER

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la tarea
 *         title:
 *           type: string
 *           description: Descripcion de la tarea
 *         status:
 *           type: string
 *           description: Estado de la tarea (ToDo - pending - Done)
 *         responsible:
 *           type: string
 *           description: Quien tiene asignada la tarea
 *     TaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Descripcion de la tarea
 *         status:
 *           type: string
 *           description: Estado de la tarea (ToDo - pending - Done)
 *         responsible:
 *           type: string
 *           description: Responsable de la tarea
 *       required:
 *         - title
 *         - status
 *         - responsible
 */
