const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
///const fs = require("fs"); //// lo use para generar archibo json de swagger para pages

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de TO-DO LIST",
      version: "1.0.0",
      description: "Una API para administrar un To-Do list",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./index.js"], // Ruta a los archivos de ruta donde están definidas las rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
// // Generar la especificación de Swagger en formato JSON
// const swaggerJson = JSON.stringify(swaggerSpec, null, 2);//// lo use para generar archibo json de swagger para pages

// // Escribir la especificación en un archivo swagger.json
// fs.writeFileSync("swagger.json", swaggerJson, "utf8");//// lo use para generar archibo json de swagger para pages

// console.log("Swagger specification generated successfully.");//

module.exports = {
  swaggerUi,
  swaggerSpec,
};
