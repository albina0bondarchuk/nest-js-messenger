import { Chats } from 'src/model/chat.entity';
import { Messages } from 'src/model/message.entity';
import { Users } from 'src/model/user.entity';
import { DataSource } from 'typeorm';

export const messageProviders = [
  {
    provide: 'MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Messages),
    inject: ['DATA_SOURCE']
  },
  {
    provide: 'CHAT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chats),
    inject: ['DATA_SOURCE']
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
    inject: ['DATA_SOURCE']
  }
];
