import bcrypt from 'bcrypt';

class BcryptService {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = Number(process.env.SALT);
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export const bcryptService =  new BcryptService();