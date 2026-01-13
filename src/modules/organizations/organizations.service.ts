import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      select: {
        name: true,
        avatarUrl: true,
        type: true,
      },
      where: { id },
    })

    return organization
  }
}
