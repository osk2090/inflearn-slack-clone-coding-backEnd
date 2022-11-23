import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private dataSource: DataSource,
  ) {}

  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });
      // throw new Error('롤백!');
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        Userid: returned.id,
        WorkspaceId: 1,
      });
      await queryRunner.manager.getRepository(ChannelMembers).save({
        Userid: returned.id,
        ChannelId: 1,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
