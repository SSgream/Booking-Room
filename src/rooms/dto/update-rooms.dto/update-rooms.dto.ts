import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from '../create-rooms.dto/create-rooms.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
