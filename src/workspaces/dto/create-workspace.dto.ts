import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Workspaces } from '../../entities/Workspaces';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '슬리랙트',
    description: '워크스페이스명',
  })
  public workspace: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sleact',
    description: 'url 주소',
  })
  public url: string;
}
