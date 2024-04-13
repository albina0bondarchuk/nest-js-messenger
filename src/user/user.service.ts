import { Inject, Injectable } from '@nestjs/common';
import { Users } from '../model/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>
  ) {}

  async findOneById(id: number): Promise<Users> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.contacts', 'user_contacts')
      .leftJoin('user_contacts.contact', 'user')
      .addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.avatar'])
      .where('users.id =:id', { id })
      .getOne();
  }

  async findOneByUsername(nickname: string): Promise<Users> {
    return this.userRepository.findOneBy({
      nickname
    });
  }

  async findByUsernameOrEmail(nickname: string, email: string): Promise<Users> {
    return this.userRepository
      .createQueryBuilder('users')
      .where('nickname = :nickname', { nickname })
      .orWhere('email = :email', { email })
      .getOne();
  }

  async create(
    createUserDto: CreateUserDto & { createdAt: Date }
  ): Promise<Users> {
    return this.userRepository.save(createUserDto);
  }
}
