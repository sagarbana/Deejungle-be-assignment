import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";
import { CreateTaskDto, UpdateTaskDto } from "../dto/TaskDto";

const taskRepository = AppDataSource.getRepository(Task);


export const create = async (userId: number, data: CreateTaskDto) => {
  const task = taskRepository.create({
    ...data,
    user_id: userId,
  });
  return await taskRepository.save(task);
};

export const findAll = async (userId: number) => {
  return await taskRepository.find({
    where: { user_id: userId },
    order: { created_at: "DESC" },
  });
};

export const findOne = async (userId: number, taskId: number) => {
  const task = await taskRepository.findOne({
    where: { id: taskId, user_id: userId },
  });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};

export const update = async (userId: number, taskId: number, data: UpdateTaskDto) => {
  const task = await findOne(userId, taskId);
  taskRepository.merge(task, data);
  return await taskRepository.save(task);
};

export const remove = async (userId: number, taskId: number) => {
  const task = await findOne(userId, taskId);
  return await taskRepository.softRemove(task);
};

