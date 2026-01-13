import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from '@/modules/auth/strategies/jwt.strategy'
import { EstimatesService } from '../estimates.service'

@Controller('/estimates/:organizationId')
@UseGuards(JwtAuthGuard)
export class GetOrganizationController {
  constructor(private estimatesService: EstimatesService) { }

  @Get()
  async getOrganizationEstimates(@CurrentUser() { sub }: TokenPayload) {
    if (!sub) {
      throw new BadRequestException('Missing params')
    }

    const estiamtes = await this.estimatesService.getOrganizationEstimates(sub)

    return estiamtes
  }
}
