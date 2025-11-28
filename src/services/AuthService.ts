import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { RegisterUserDto, LoginUserDto } from "../dto/AuthDto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);


export const register = async (data: RegisterUserDto) => {
  const existingUser = await userRepository.findOneBy({ username: data.username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = userRepository.create({
    username: data.username,
    password: hashedPassword,
  });

  await userRepository.save(user);
  return { id: user.id, username: user.username };
};

export const login = async (data: LoginUserDto) => {
  const user = await userRepository.findOneBy({ username: data.username });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return { token };
};

