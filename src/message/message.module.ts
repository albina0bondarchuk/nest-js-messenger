import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { messageProviders } from './message.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { ProducerModule } from 'src/producer/producer.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [DatabaseModule, UserModule, ChatModule, ProducerModule],
  providers: [...messageProviders, MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
