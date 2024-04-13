import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';

@Injectable()
export class ProducerService {
  constructor(private readonly sqsService: SqsService) {}

  async sendMessage(body: any) {
    const message = {
      id: body.message.text,
      body: JSON.stringify(body),
      groupId: `messages${body.creator}`
    };

    try {
      await this.sqsService.send(process.env.AWS_QUEUE_NAME, message);
    } catch (error) {
      console.log('error in producing image!', error);
    }
  }
}
