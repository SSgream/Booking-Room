export class CreateBookingsDto {}
import { IsDateString, IsInt } from "class-validator";

export class CreateBookingDto {

  @IsInt()
  userId: number;

  @IsInt()
  roomId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
