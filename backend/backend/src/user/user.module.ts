import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UserController } from 'src/user/user.controller';
import { UsersRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity'
import { UserEvent } from 'src/user/user.event';
import { Message } from 'src/chat/message/entity/message.entity';
import { Participate } from 'src/participate/participate.entity'
import { UserRelation } from './entity/friend-request.entity';
import { Achievement } from './entity/achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message, Participate, UsersRepository, UserRelation, Achievement]),
    MulterModule.register({
      dest: './upload',
    })
  ],
  controllers: [UserController],
  providers: [UserService, UserEvent],
  exports: [UserService, UserEvent]
})
export class UserModule { }
