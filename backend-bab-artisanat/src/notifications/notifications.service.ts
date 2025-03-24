import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) {}

  async createNotification(recipientId: string, message: string) {
    console.log("📩 Creating notification for user:", recipientId);
    
    const notification = new this.notificationModel({
      user: new Types.ObjectId(recipientId), 
      message,
    });
  
    await notification.save();
  }
  
  async getNotifications(userId: string) {
    return await this.notificationModel.find({ user: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }
  
  async markAsRead(notificationId: string) {
    return await this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }

  async deleteNotification(notificationId: string) {
    return await this.notificationModel.findByIdAndDelete(notificationId);
  }
}
