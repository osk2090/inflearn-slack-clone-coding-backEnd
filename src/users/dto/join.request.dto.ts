import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'osk2090@naver.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: 'osk2090',
    description: '닉네임',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: '2090',
    description: '비밀번호',
    required: true,
  })
  public password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
