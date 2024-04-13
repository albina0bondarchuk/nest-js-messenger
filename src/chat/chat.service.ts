import { Inject, Injectable } from '@nestjs/common';
import { UserRole } from 'src/constants/chats';
import { ACTIVE_STATUS } from 'src/constants/settings';
import { Chats } from 'src/model/chat.entity';
import { ChatUser } from 'src/model/chat_user.entity';
import { Users } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatsRepository: Repository<Chats>,
    @Inject('CHAT_USER_REPOSITORY')
    private readonly chatUserRepository: Repository<ChatUser>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>
  ) {}

  async findChatById(id: number): Promise<Chats> {
    return this.chatsRepository.findOneBy({ id });
  }

  async findChatsByUserId(userId: number): Promise<ChatUser[]> {
    return this.chatUserRepository
      .createQueryBuilder('chat_user')
      .innerJoinAndSelect('chat_user.chatId', 'chats')
      .innerJoin('chat_user.user', 'users')
      .where('users.id = :userId', { userId: userId })
      .andWhere('status = :status', { status: ACTIVE_STATUS })
      .getMany();
  }

  async findUserInChat(userId: number, chatId: number): Promise<ChatUser> {
    return this.chatUserRepository
      .createQueryBuilder('chatUser')
      .where('chatUser.userId = :userId', { userId })
      .andWhere('chatUser.chatId = :chatId', { chatId })
      .getOne();
  }

  async updateChat(chat: Chats): Promise<Chats> {
    return this.chatsRepository.save(chat);
  }

  async createChat(chat: any): Promise<Chats> {
    const newChat = await this.chatsRepository.save(chat);

    const userPromises = chat.users.map(async (user) => {
      const dbUser = await this.userRepository.findOneBy({ id: user });

      await this.chatUserRepository.save({
        user: dbUser,
        role: user === chat.creator.id ? UserRole.ADMIN : UserRole.DEFAULT,
        chatId: newChat.id
      });
    });

    await Promise.all(userPromises);

    return newChat;
  }
}
