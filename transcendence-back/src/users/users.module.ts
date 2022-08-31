import { Module } from '@nestjs/common';
import { UserController, UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { MatchHistory } from 'src/entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MatchHistory])],
  controllers: [UsersController, UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
