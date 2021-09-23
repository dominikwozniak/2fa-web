import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  redis;

  constructor() {
    this.redis = new Redis();
  }

  checkAlive() {
    console.log('HELLO >>>')
  }

  async getValue(key: string) {
    return this.redis.get(key);
  }

  async setValue(key: string, value: string) {
    return this.redis.set(key, value, 'ex', 60 * 60 * 24);
  }
}
