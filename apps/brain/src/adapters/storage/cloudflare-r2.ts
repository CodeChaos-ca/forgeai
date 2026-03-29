import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { IStorageAdapter } from '../types';
import { CLOUDFLARE_R2_FREE_STORAGE_GB } from '../../config/free-tier-limits';

export class CloudflareR2Adapter implements IStorageAdapter {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.R2_BUCKET_NAME || 'forgeai-r2';
    this.client = new S3Client({
      endpoint: process.env.R2_ENDPOINT || 'https://xxxxxxxxxxxxxxxx.r2.cloudflarestorage.com',
      region: 'auto',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  private async withRetry<T>(operation: () => Promise<T>, attempts: number = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  async upload(key: string, data: Buffer, mimeType: string): Promise<string> {
    return this.withRetry(async () => {
      await this.client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: mimeType,
      }));
      return key;
    });
  }

  async download(key: string): Promise<Buffer> {
    return this.withRetry(async () => {
      const response = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      const byteArray = await response.Body?.transformToByteArray();
      if (!byteArray) throw new Error('Empty stream');
      return Buffer.from(byteArray);
    });
  }

  async delete(key: string): Promise<void> {
    return this.withRetry(async () => {
      await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    });
  }

  async getSignedUrl(key: string, ttlSeconds: number): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return await getSignedUrl(this.client, cmd, { expiresIn: ttlSeconds });
  }

  async getUsage(): Promise<{ usedBytes: number; limitBytes: number }> {
    return {
      usedBytes: 0,
      limitBytes: CLOUDFLARE_R2_FREE_STORAGE_GB * 1024 * 1024 * 1024
    };
  }
}
