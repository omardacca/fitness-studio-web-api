export interface NotificationService {
    sendSms(to: string, message: string): Promise<void>;
}  