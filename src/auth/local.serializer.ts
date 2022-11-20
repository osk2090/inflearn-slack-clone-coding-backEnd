import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super();
  }

  serializeUser(user: any, done: Function): any {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: Function) {
    return this.usersRepository
      .findOneOrFail({
        where: {
          id: +userId,
        },
        select: ['id', 'email', 'nickname'],
        relations: ['Workspaces'],
      })
      .then((user) => {
        console.log('user', user);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  }
}
