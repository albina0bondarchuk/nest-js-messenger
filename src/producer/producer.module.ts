import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ProducerService } from './producer.service';
import * as AWS from 'aws-sdk';
import { ConfigModule, ConfigService } from '@nestjs/config';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

@Module({
  imports: [
    SqsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        consumers: [],
        producers: [
          {
            name: configService.get('AWS_QUEUE_NAME'),
            queueUrl: configService.get('AWS_QUEUE_URL')
          }
        ]
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [ProducerService],
  exports: [ProducerService]
})
export class ProducerModule {}
