import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

// Hash of "Nuria,2001!"
const ADMIN_PASSWORD_HASH = '$2b$10$w.FL1Fq56xCF7.IaMkUGq.HI3QqPKP6vbzT9T4NAGUlayBervQwpy';
const ADMIN_USERNAME = 'admin';

export const verifyCredentials = async (username: string, password: string): Promise<boolean> => {
  if (username !== ADMIN_USERNAME) {
    return false;
  }
  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
};

export const checkAuth = async (request: NextRequest): Promise<boolean> => {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials); // decode base64
    const [username, password] = credentials.split(':');

    return await verifyCredentials(username, password);
  } catch (error) {
    return false;
  }
};