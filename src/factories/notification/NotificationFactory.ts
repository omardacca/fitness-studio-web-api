import { AwsSnsNotification } from './AwsSnsNotification';
import { LoggerNotification } from './LoggerNotification';

export enum NotificationType {
  AWS_SNS = 'AWS_SNS',
  LOGGER = 'LOGGER'
}

export interface INotification {
  send(phoneNumber: string, message: string): Promise<void>;
}

export class NotificationFactory {
  public static create(): INotification {
    const provider = process.env.NOTIFICATION_PROVIDER || NotificationType.AWS_SNS;

    switch (provider?.toUpperCase()) {
      case NotificationType.AWS_SNS:
        return AwsSnsNotification.getInstance();
        
      case NotificationType.LOGGER:
        return new LoggerNotification();
      default:
        throw new Error(`Unsupported notification provider: ${process.env.NOTIFICATION_PROVIDER}`);
    }
  }
}
