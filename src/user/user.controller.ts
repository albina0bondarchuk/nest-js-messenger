import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserService } from './user.service';

@Controller('secured')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AccessTokenGuard)
  @Get('user')
  getUser(@Req() req) {
    return this.userService.findOneById(req.user['userId']);
  }
}
