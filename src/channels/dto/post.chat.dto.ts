import { PickType } from '@nestjs/swagger';
import { ChannelChats } from '../../entities/ChannelChats';

export class PostChatDto extends PickType(ChannelChats, ['content']) {}
