import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-users.dto/update-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword
      }
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email }
  });
}


  async update(id: number, data: UpdateUserDto) {

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
