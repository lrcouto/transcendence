import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Intra42AuthGuard } from './guards/intra42.guard';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(Intra42AuthGuard)
  intraLogin() {
    return;
  }

  @Get('redirect')
  @UseGuards(Intra42AuthGuard)
  intraRedirect(@Res() res: Response) {
    res.send(200);
  }

  @Get('status')
  getUserStatus() { }

  @Get('logout')
  logoutUser() { }
}
