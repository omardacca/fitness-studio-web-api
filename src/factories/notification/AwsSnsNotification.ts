import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export class AwsSnsNotification {
  private static instance: AwsSnsNotification;
  private client: SNSClient;

  private constructor() {
    const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS SNS configuration is missing. Ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set.');
    }

    this.client = new SNSClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      throw new Error(`Invalid phone number format: ${phoneNumber}. Must be E.164 format.`);
    }

    try {
      console.log('📤 Sending SMS vn,nlnia AWS SNS:', { phoneNumber, message });

    const response = await this.client.send(
  new PublishCommand({
    Message: message,
    PhoneNumber: phoneNumber,
    MessageAttributes: {
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional',
      },
    },
  })
);

console.log(`✅ SNS Response:`, response);


      console.log(`✅ SMS sent to ${phoneNumber}`);
    } catch (error) {
      console.error(`❌ Error sending SMS to ${phoneNumber}:`, error);
      throw error;
    }
  }
}
