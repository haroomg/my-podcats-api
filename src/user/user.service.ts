import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    const username: string = data.username;
    const email: string = data.email;
    const password: string = data.password;
    const confirmPassword: string = data.confirmPassword;

    const existsUser = await this.prisma.user.findUnique({
      where: { username },
    });
    const existsEmail = await this.prisma.user.findUnique({ where: { email } });

    if (existsUser) {
      throw new ConflictException('Username already exists');
    }
    if (existsEmail) {
      throw new ConflictException('Email already exists');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const userEntity: UserEntity = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.createdAt,
    };

    return userEntity;
  }
}
