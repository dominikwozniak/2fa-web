import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/check-alive')
  @ApiOkResponse({
    description: 'Check alive',
  })
  checkAlive(): string {
    return this.appService.checkAlive();
  }
}
