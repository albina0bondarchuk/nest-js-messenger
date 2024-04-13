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
  Req,
  UseGuards
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CreateChatDto } from './dto/CreateChatDto';
import { UserService } from 'src/user/user.service';
import { DEFAULT_CHAT_PROPS, UserRole } from 'src/constants/chats';
import { DELETED_STATUS } from 'src/constants/settings';

@Controller('secured/chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async getChats(@Req() req) {
    const userId = parseInt(req.user['userId']);
    const chatsByUsers = await this.chatService.findChatsByUserId(userId);
    const preparedChats = chatsByUsers.map((chat) => chat.chatId);

    return preparedChats;
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  async createChat(@Req() req, @Body() data: CreateChatDto) {
    const creatorId: number = req.auth.userId;
    const creator = await this.userService.findOneById(creatorId);

    const newChat = {
      ...data,
      users: [data.users, creatorId],
      creator,
      ...DEFAULT_CHAT_PROPS
    };

    return this.chatService.createChat(newChat);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('')
  async deleteChat(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const currentChat = await this.chatService.findChatById(id);
    const userId = req.auth.userId;

    const currentUserWithRole = await this.chatService.findUserInChat(
      userId,
      id
    );

    if (currentUserWithRole.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete the chat'
      );
    }

    return this.chatService.updateChat({
      ...currentChat,
      status: DELETED_STATUS
    });
  }

  @UseGuards(AccessTokenGuard)
  @Patch('')
  async updateChat(
    @Req() req,
    @Body() data: CreateChatDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    const currentChat = await this.chatService.findChatById(id);
    const userId = req.auth.userId;

    const currentUserWithRole = await this.chatService.findUserInChat(
      userId,
      id
    );

    if (currentUserWithRole.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete the chat'
      );
    }

    return this.chatService.updateChat({
      ...currentChat,
      ...data
    });
  }
}
