import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import { AuthDto } from './dto/AuthDto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller('public')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req) {
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(refreshToken);
  }
}
