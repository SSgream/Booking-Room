import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch
} from '@nestjs/common';

import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-rooms.dto/create-rooms.dto';
import { UpdateRoomDto } from './dto/update-rooms.dto/update-rooms.dto';

@Controller('rooms')
export class RoomsController {

  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() body: CreateRoomDto) {
    return this.roomsService.create(body);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateRoomDto
  ) {
    return this.roomsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(Number(id));
  }
}
