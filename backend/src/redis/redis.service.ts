import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis = new Redis(process.env.REDIS_URI);

  async getValue(key: string): Promise<any> {
    return this.redis.get(key);
  }

  async setValue(key: string, value: string): Promise<any> {
    return this.redis.set(key, value, 'ex', 60 * 60 * 24);
  }

  async delete(key: string): Promise<any> {
    return this.redis.del(key);
  }
}
