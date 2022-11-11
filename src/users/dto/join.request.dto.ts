export class JoinRequestDto {
  public email: string;
  public nickname: string;
  public password: string;

  constructor(email: string, nickname: string, password: string) {
    this.email = email;
    this.nickname = nickname;
    this.password = password;
  }
}
