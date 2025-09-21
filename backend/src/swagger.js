const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Finance Tracker API",
      version: "1.0.0",
      description: "API documentation for Personal Finance Tracker",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  // 👇 Use absolute path so it always resolves
  apis: [path.join(__dirname, "routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
