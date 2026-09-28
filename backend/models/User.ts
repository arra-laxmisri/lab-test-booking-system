import bcrypt from 'bcryptjs';
import { dbStore, IUser } from '../config/db.js';

export class UserModel {
  static async find(): Promise<IUser[]> {
    return dbStore.getDatabase().users;
  }

  static async findById(id: string): Promise<IUser | null> {
    const user = dbStore.getDatabase().users.find(u => u._id === id);
    return user || null;
  }

  static async findOne(query: { email?: string; phone?: string }): Promise<IUser | null> {
    const users = dbStore.getDatabase().users;
    if (query.email) {
      const match = users.find(u => u.email.toLowerCase() === query.email!.toLowerCase());
      if (match) return match;
    }
    if (query.phone) {
      const match = users.find(u => u.phone === query.phone);
      if (match) return match;
    }
    return null;
  }

  static async create(data: Omit<IUser, '_id' | 'createdAt'>): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser: IUser = {
      ...data,
      _id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      password: hashedPassword,
      familyMembers: data.familyMembers || [],
      createdAt: new Date().toISOString()
    };
    dbStore.getDatabase().users.push(newUser);
    dbStore.persist();
    return newUser;
  }

  static async updateById(id: string, update: Partial<IUser>): Promise<IUser | null> {
    const users = dbStore.getDatabase().users;
    const index = users.findIndex(u => u._id === id);
    if (index === -1) return null;

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const updatedUser = {
      ...users[index],
      ...update
    };
    users[index] = updatedUser;
    dbStore.persist();
    return updatedUser;
  }

  static async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
