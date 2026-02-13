import { IsInt, IsString } from "class-validator";

export class CreateRoomDto {

  @IsString()
  name: string;

  @IsInt()
  capacity: number;

  @IsString()
  location: string;
}
