import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/CreateUserDto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/AuthDto';
import { Token } from 'src/model/token.entity';
import { Repository } from 'typeorm';
import { Settings } from 'src/model/setting.entity';
import { DefaultUserSettings } from 'src/constants/settings';

@Injectable()
export class AuthService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private readonly tokensRepository: Repository<Token>,
    @Inject('SETTING_REPOSITORY')
    private readonly settingsRepository: Repository<Settings>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userExists = await this.userService.findByUsernameOrEmail(
      createUserDto.nickname,
      createUserDto.email
    );

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
      createdAt: new Date()
    });

    await this.createSettings(newUser.id);
  }

  async signIn(data: AuthDto) {
    const user = await this.userService.findOneByUsername(data.nickname);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await this.comparePassword(
      data.password,
      user.password
    );

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.updateTokens(user.id);

    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const token = await this.findToken(refreshToken);
    const newTokens = await this.updateTokens(token.userId);

    return newTokens;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
  }

  async comparePassword(password: string, encryptedPassword: string) {
    return bcrypt.compare(password, encryptedPassword);
  }

  async updateTokens(userId: number) {
    const accessToken = await this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken();

    await this.refreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  generateAccessToken(userId: number) {
    const payload = { userId, type: 'access' };
    const option = {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      secret: process.env.JWT_ACCESS_SECRET
    };

    return this.jwtService.signAsync(payload, option);
  }

  generateRefreshToken() {
    const payload = {
      type: 'refresh'
    };
    const option = {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      secret: process.env.JWT_REFRESH_SECRET
    };

    return this.jwtService.signAsync(payload, option);
  }

  async refreshToken(userId: number, tokenId: string) {
    await this.tokensRepository.delete({ userId });
    await this.tokensRepository.save({ userId, tokenId });
  }

  async findToken(tokenId: string): Promise<Token> {
    return this.tokensRepository.findOneBy({ tokenId })
  }

  async createSettings(userId: number): Promise<Settings> {
    return this.settingsRepository.save({
      userId,
      chatSetting: DefaultUserSettings
    });
  }
}
