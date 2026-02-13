import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-rooms.dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto/update-rooms.dto';

@Injectable()
export class RoomsService {

  constructor(private prisma: PrismaService) {}

  create(data: CreateRoomDto) {
    return this.prisma.room.create({
      data
    });
  }

  findAll() {
    return this.prisma.room.findMany();
  }

  findOne(id: number) {
    return this.prisma.room.findUnique({
      where: { id }
    });
  }

  update(id: number, data: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data
    });
  }

  remove(id: number) {
    return this.prisma.room.delete({
      where: { id }
    });
  }
}
