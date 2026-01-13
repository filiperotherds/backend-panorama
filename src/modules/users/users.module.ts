import { Module } from '@nestjs/common'
import { GetUserProfileController } from './controllers/get-profile.controller'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'

@Module({
  imports: [],
  controllers: [GetUserProfileController],
  providers: [UsersService, JwtAuthGuard, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
