declare namespace Express {
  export interface Request {
    tenantId?: string;
    deviceId?: string;
    user?: {
      userId: string;
      phoneNumber: string;
      tenantId: string;
      role: string;
      deviceId?: string;
    };
  }
}  