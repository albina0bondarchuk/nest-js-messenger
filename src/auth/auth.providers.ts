import { Settings } from 'src/model/setting.entity';
import { Token } from 'src/model/token.entity';
import { DataSource } from 'typeorm';

export const authProviders = [
  {
    provide: 'TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
    inject: ['DATA_SOURCE']
  },
  {
    provide: 'SETTING_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Settings),
    inject: ['DATA_SOURCE']
  }
];
