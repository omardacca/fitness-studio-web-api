import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class AwsSnsNotification {
  private static instance: AwsSnsNotification;
  private client: SNSClient;

  private constructor() {
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS SNS configuration is missing. Ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.');
    }

    this.client = new SNSClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  public static getInstance(): AwsSnsNotification {
    if (!AwsSnsNotification.instance) {
      AwsSnsNotification.instance = new AwsSnsNotification();
    }
    return AwsSnsNotification.instance;
  }

  async send(phoneNumber: string, message: string): Promise<void> {
    try {
      await this.client.send(
        new PublishCommand({
          Message: message,
          PhoneNumber: phoneNumber,
        })
      );
      console.log(`✅ SMS sent to ${phoneNumber}: ${message}`);
    } catch (error) {
      console.error(`❌ Error sending SMS to ${phoneNumber}:`, error);
      throw error;
    }
  }
}
