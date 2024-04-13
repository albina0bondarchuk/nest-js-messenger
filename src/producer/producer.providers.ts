import { SqsModule } from '@ssut/nestjs-sqs';

export const producerProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      SqsModule.register({
        consumers: [],
        producers: [
          {
            name: process.env.AWS_QUEUE_NAME,
            queueUrl: process.env.AWS_QUEUE_URL
          }
        ]
      });
    }
  }
];
