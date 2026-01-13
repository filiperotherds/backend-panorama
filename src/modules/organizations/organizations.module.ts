import { Module } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PrismaService } from '@/database/prisma/prisma.service'
import { OrganizationsService } from './organizations.service'
import { GetOrganizationController } from './controllers/get-organization.controller'

@Module({
  imports: [],
  controllers: [GetOrganizationController],
  providers: [OrganizationsService, JwtAuthGuard, PrismaService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
