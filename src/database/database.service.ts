import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DatabaseService {
  private users: User[] = [];
  private nextId = 1;

  getUsers(): User[] {
    return this.users;
  }

  findUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, userData: Partial<Omit<User, 'id'>>): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    const originalUser = this.users[userIndex];
    const updatedUser = {
      ...originalUser,
      ...userData,
      updatedAt: new Date(),
    };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  deleteUser(id: number): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    const [deletedUser] = this.users.splice(userIndex, 1);
    return deletedUser;
  }

  resetData() {
    this.users = [];
    this.nextId = 1;
  }
}