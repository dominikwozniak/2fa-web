import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkAlive(): string {
    return 'Server running!';
  }
}
