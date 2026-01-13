import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) { }

  async getOrganizationByUserId(sub: string) {
    const membership = await this.prisma.member.findFirst({
      where: {
        userId: sub,
      },
      select: {
        organization: {
          select: {
            avatarUrl: true,
            name: true,
          },
        },
        role: true,
      },
    })

    return membership
  }
}
