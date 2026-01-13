import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationEstimates(profileId: string) {
    const estiamtes = await this.prisma.estimate.findMany({
      select: {
        id: true,
        createdAt: true,
        description: true,
        value: true,
      },
      where: { providerProfileId: profileId },
    })

    return estiamtes
  }
}
