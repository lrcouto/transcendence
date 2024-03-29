import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { channelType } from 'src/entity/channel-type.entity';

export class CreateChannelDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(channelType)
  type: channelType;

  @IsNotEmpty()
  @IsUUID()
  owner: string;

  @IsOptional()
  password: string;
}

export class UpdateChannelDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(channelType)
  type: channelType;

  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  owner: string;

  @IsOptional()
  @MinLength(5)
  password: string;
}

export class MessagelDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  user: string;
}
