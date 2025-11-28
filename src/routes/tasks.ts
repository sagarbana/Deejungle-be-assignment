import { Router } from "express";

import * as TaskController from "../controllers/TaskController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.use(authenticateToken);

router.post("/", TaskController.create);
router.get("/", TaskController.findAll);
router.get("/:id", TaskController.findOne);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.remove);

export default router;
