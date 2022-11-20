import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../common/dto/user.dto';
import { User } from '../common/decorator/user.decorator';
import { UndifinedToNullInterceptor } from '../common/interceptors/undifinedToNull.interceptor';
import { LocalAuthGuards } from '../auth/local.auth.guards';
import { LoggedInGuard } from '../auth/logged-in.guard';

@UseInterceptors(UndifinedToNullInterceptor)
@ApiTags('USERS')
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: UserDto, status: 200, description: '성공' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user || false;
  }

  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() body: JoinRequestDto) {
    await this.usersService.join(body.email, body.nickname, body.password);
  }

  @UseGuards(new LocalAuthGuards())
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@User() user) {
    return user;
  }

  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
