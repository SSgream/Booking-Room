import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-bookings.dto/create-bookings.dto';
import { UpdateBookingDto } from './dto/update-bookings.dto/update-bookings.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateBookingDto, @Req() req: any) {
  return this.bookingsService.create({
    ...body,
    userId: req.user.id,
  });
}


  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateBookingDto) {
    return this.bookingsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(Number(id));
  }
}
