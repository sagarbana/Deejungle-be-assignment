import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yaml"));

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
