import { Inject, Injectable } from '@nestjs/common';
import { NotificationsTypes } from 'src/constants/notifications';
import { ACTIVE_STATUS } from 'src/constants/settings';
import { Messages } from 'src/model/message.entity';
import { ProducerService } from 'src/producer/producer.service';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messagesRepository: Repository<Messages>,
    private producerService: ProducerService
  ) {}

  async findMessageById(id: number): Promise<Messages> {
    return this.messagesRepository.findOneBy({ id });
  }

  async findMessageWithCreatorById(messageId: number): Promise<Messages> {
    return this.messagesRepository
      .createQueryBuilder('messages')
      .innerJoinAndSelect('messages.creator', 'users')
      .where('messages.id =:messageId', { messageId })
      .getOne();
  }

  async findMessagesByChatId(chatId: number): Promise<any> {
    return this.messagesRepository
      .createQueryBuilder('messages')
      .innerJoinAndSelect('messages.creator', 'users')
      .innerJoin('messages.chat', 'chats')
      .where('chats.id =:chatId', { chatId })
      .andWhere('messages.status =:status', { status: ACTIVE_STATUS })
      .orderBy('messages.createdAt', 'ASC')
      .getMany();
  }

  async createMessage(message: any): Promise<void> {
    const successAddedMessage = await this.messagesRepository.save(message);

    const preparedNotificationMessage = {
      type: NotificationsTypes.CREATE_MESSAGE,
      message: {
        text: successAddedMessage.text,
        creator: `${successAddedMessage.creator.firstName} ${successAddedMessage.creator.lastName}`,
        creatorId: successAddedMessage.creator.id,
        icon:
          successAddedMessage.chat.icon ||
          successAddedMessage.creator.avatar ||
          null,
        createdAt: successAddedMessage.createdAt
      },
      chatId: successAddedMessage.chat.id
    };

    await this.producerService.sendMessage(preparedNotificationMessage);
  }

  async saveMessage(message: Messages): Promise<Messages> {
    console.log(message);

    return this.messagesRepository.save(message);
  }
}
