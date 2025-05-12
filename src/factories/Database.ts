import { PrismaClient } from '@prisma/client';

class Database {
  private static instance: PrismaClient;

  private constructor() {} // Prevent direct instantiation

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
    }
    return Database.instance;
  }
}

export default Database;
