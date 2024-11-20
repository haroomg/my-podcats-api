import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    orderBy: 'asc' | 'desc' = 'asc',
    limit: number = 10,
  ): Promise<Array<UserEntity>> {
    let userList: Array<UserEntity> = [];
    const users = await this.prisma.user.findMany({
      orderBy: {
        id: orderBy,
      },
    });

    for (let i = 0; i < users.length; i++) {
      let user = users[i];

      let userEntity: UserEntity = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.createdAt,
      };
      userList.push(userEntity);
    }
    return userList.slice(0, limit);
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User  with ID ${id} not found`);
    }

    const userEntity: UserEntity = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.createdAt,
    };
    return userEntity;
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
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
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
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
