import { PrismaService } from '@/database/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) { }

  async getOrganizationEstimates(sub: string) {
    const response = await this.prisma.member.findFirst({
      where: {
        userId: sub,
      },
      select: {
        organizationId: true,
      },
    })

    if (!response) {
      throw new BadRequestException('OrganizationId not found')
    }

    const organizationId = response.organizationId

    const estiamtes = await this.prisma.estimate.findMany({
      select: {
        id: true,
        createdAt: true,
        description: true,
        value: true,
      },
      where: {
        organizationId,
      },
    })

    return estiamtes
  }
}
