import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
  }

  async create(createUserDto: CreateUserDto) {
    // Hash the provided password (field is named `passwordHash` in the DTO)
    const hashed = await bcrypt.hash(createUserDto.passwordHash, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash: hashed,
      },
      omit: {
        passwordHash: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({omit: { passwordHash: true }});
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });

    if (!user) {
      throw new Error(`User with ID ${id} does not exist.`);
    }

    return user;
  }
  //
  // async update(id: number, updateUserDto: Partial<CreateUserDto>) {
  //   try {
  //     // If a new password is provided, hash it before updating
  //     if (updateUserDto.passwordHash) {
  //       updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.passwordHash, 10);
  //     }
  //
  //     return this.prisma.user.update({
  //       where: { id },
  //       data: updateUserDto,
  //     });
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
  //       throw new Error(`User with ID ${id} does not exist.`);
  //     }
  //   }
  // }
  //
  // remove(id: number) {
  //   try {
  //     return this.prisma.user.delete({
  //       where: { id },
  //     });
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
  //       throw new Error(`User with ID ${id} does not exist.`);
  //     }
  //   }
  // }
}
