import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MessageService } from './message.service';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { DEFAULT_MESSAGE_PROPS } from 'src/constants/messages';
import { DELETED_STATUS } from 'src/constants/settings';

@Controller('secured/messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async getMessages(@Query('chatId', ParseIntPipe) chatId: number) {
    const messages = await this.messageService.findMessagesByChatId(chatId);

    const preparedMessages = messages.map((message) => ({
      ...message,
      creator: {
        id: message.creator.id,
        fullname: `${message.creator.firstName} ${message.creator.lastName}`,
        nickname: message.creator.nickname,
        avatar: message.creator.avatar,
        email: message.creator.email,
        phoneNumber: message.creator.phoneNumber
      }
    }));

    return preparedMessages;
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  async createMessage(@Req() req, @Body() data: CreateMessageDto) {
    const creatorId: number = parseInt(req.user['userId']);

    const creator = await this.userService.findOneById(creatorId);
    const chat = await this.chatService.findChatById(data.chatId);

    const newMessage = {
      text: data.text,
      creator,
      chat,
      ...DEFAULT_MESSAGE_PROPS
    };
    await this.messageService.createMessage(newMessage);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteMessage(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = parseInt(req.user['userId']);

    const deletedMessage =
      await this.messageService.findMessageWithCreatorById(id);

    if (userId !== deletedMessage.creator.id) {
      throw new ForbiddenException(
        'You do not have permission to delete the chat'
      );
    }

    return this.messageService.saveMessage({
      ...deletedMessage,
      status: DELETED_STATUS
    });
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateChat(
    @Req() req,
    @Body() data: { entity: string },
    @Param('id', ParseIntPipe) id: number
  ) {
    const userId = parseInt(req.user['userId']);

    const updatedMessage =
      await this.messageService.findMessageWithCreatorById(id);

    if (userId !== updatedMessage.creator.id) {
      throw new ForbiddenException(
        'You do not have permission to delete the chat'
      );
    }

    return this.messageService.saveMessage({
      ...updatedMessage,
      text: data.entity
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('forward')
  async forwardMessage(@Req() req, @Body() data: CreateMessageDto) {
    const creatorId: number = parseInt(req.user['userId']);

    const creator = await this.userService.findOneById(creatorId);
    const chat = await this.chatService.findChatById(data.chatId);

    const { referenceTo, text, creator: forwardedBy } = req.body;

    const newMessage = {
      text,
      creator,
      forwardedBy,
      chat,
      referenceTo,
      ...DEFAULT_MESSAGE_PROPS
    };

    await this.messageService.createMessage(newMessage);
  }
}
