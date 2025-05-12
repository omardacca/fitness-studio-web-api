import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  SERVICE_MODE: process.env.SERVICE_MODE || 'default'
};
