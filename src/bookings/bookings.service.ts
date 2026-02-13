import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-bookings.dto/create-bookings.dto';
import { UpdateBookingDto } from './dto/update-bookings.dto/update-bookings.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBookingDto) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    // 🔥 VALIDASI BENTROK JADWAL
    const conflict = await this.prisma.booking.findFirst({
      where: {
        roomId: data.roomId,
        AND: [
          {
            startTime: { lt: end },
          },
          {
            endTime: { gt: start },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('Room already booked in this time range');
    }

    return this.prisma.booking.create({
      data: {
        userId: data.userId,
        roomId: data.roomId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        room: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: true,
      },
    });
  }

  update(id: number, data: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
