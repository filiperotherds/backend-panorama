import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class VerficationsService {
  constructor(private prisma: PrismaService) {}
}
