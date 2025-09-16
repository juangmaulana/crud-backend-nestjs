import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(createUserDto: CreateUserDto): User {
    const now = new Date();
    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    const originalUser = this.users[userIndex];
    const updatedUser = {
      ...originalUser,
      ...updateUserDto,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: number): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    const [deletedUser] = this.users.splice(userIndex, 1);
    return deletedUser;
  }
  
  // Helper to reset data for tests
  resetData() {
    this.users = [];
    this.nextId = 1;
  }
}