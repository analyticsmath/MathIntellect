import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async listForUser(userId: string): Promise<Notification[]> {
    return this.notificationsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async markRead(userId: string, id: string): Promise<Notification> {
    const item = await this.notificationsRepo.findOne({
      where: { id, userId },
    });
    if (!item) {
      throw new NotFoundException('Notification not found');
    }

    if (!item.readAt) {
      item.readAt = new Date();
      await this.notificationsRepo.save(item);
    }

    return item;
  }
}
