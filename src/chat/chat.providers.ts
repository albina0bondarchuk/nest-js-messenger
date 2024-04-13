import { Chats } from 'src/model/chat.entity';
import { ChatUser } from 'src/model/chat_user.entity';
import { Users } from 'src/model/user.entity';
import { DataSource } from 'typeorm';

export const chatProviders = [
  {
    provide: 'CHAT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chats),
    inject: ['DATA_SOURCE']
  },
  {
    provide: 'CHAT_USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatUser),
    inject: ['DATA_SOURCE']
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
    inject: ['DATA_SOURCE']
  }
];
