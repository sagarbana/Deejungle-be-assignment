import { Request, Response } from "express";
import * as taskService from "../services/TaskService";

import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateTaskDto, UpdateTaskDto } from "../dto/TaskDto";
import { AuthRequest } from "../middlewares/auth";


export const create = async (req: AuthRequest, res: Response) => {
  try {
    const createTaskDto = plainToClass(CreateTaskDto, req.body);
    const errors = await validate(createTaskDto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const task = await taskService.create(req.user!.userId, createTaskDto);
    return res.status(201).json(task);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const findAll = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await taskService.findAll(req.user!.userId);
    return res.json(tasks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const findOne = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.findOne(req.user!.userId, Number(req.params.id));
    return res.json(task);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const updateTaskDto = plainToClass(UpdateTaskDto, req.body);
    const errors = await validate(updateTaskDto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const task = await taskService.update(req.user!.userId, Number(req.params.id), updateTaskDto);
    return res.json(task);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await taskService.remove(req.user!.userId, Number(req.params.id));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

