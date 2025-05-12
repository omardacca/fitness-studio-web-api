import { INotification } from './NotificationFactory';

export class LoggerNotification implements INotification {
  async send(phoneNumber: string, message: string): Promise<void> {
    console.log(`[LoggerNotification] send() called with:`);
    console.log(`📞 PhoneNumber: ${phoneNumber}`);
    console.log(`✉️ Message: ${message}`);
  }
}
