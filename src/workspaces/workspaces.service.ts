import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspaces } from '../entities/Workspaces';
import { Repository } from 'typeorm';
import { Channels } from '../entities/Channels';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: { WorkspaceMembers: { UserId: myId } },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const workspace = this.workspacesRepository.create({
      name,
      url,
      OwnerId: myId,
    });
    const returned = await this.workspacesRepository.save(workspace);
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    const [, channelReturned] = await Promise.all([
      this.workspaceMembersRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMembers(url: string) {
    await this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.WorkspaceMembers', 'm')
      .innerJoin('m.Workspace', 'w', 'w.url = :url', { url })
      .getMany();
  }
}
