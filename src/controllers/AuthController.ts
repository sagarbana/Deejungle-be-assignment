import { Request, Response } from "express";

import * as authService from "../services/AuthService";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { RegisterUserDto, LoginUserDto } from "../dto/AuthDto";

export const register = async (req: Request, res: Response) => {
  try {
    const registerDto = plainToClass(RegisterUserDto, req.body);
    const errors = await validate(registerDto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await authService.register(registerDto);
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginDto = plainToClass(LoginUserDto, req.body);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const result = await authService.login(loginDto);
    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

