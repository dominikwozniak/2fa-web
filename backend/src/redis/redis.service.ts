import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis;

  constructor() {
    this.redis = new Redis();
  }

  async getValue(key: string): Promise<any> {
    return this.redis.get(key);
  }

  async setValue(key: string, value: string): Promise<string> {
    return this.redis.set(key, value, 'ex', 60 * 60 * 24);
  }
}
