import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DatabaseService) {}

  findAll(): User[] {
    return this.dbService.getUsers();
  }

  findOne(id: number): User | undefined {
    return this.dbService.findUserById(id);
  }

  create(createUserDto: CreateUserDto): User {
    // Set default value for isAdmin if not provided
    const userData = {
      ...createUserDto,
      isAdmin: createUserDto.isAdmin ?? false, // <-- FIX: Add default value
    };
    return this.dbService.createUser(userData);
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const updatedUser = this.dbService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  remove(id: number): User {
    const deletedUser = this.dbService.deleteUser(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}