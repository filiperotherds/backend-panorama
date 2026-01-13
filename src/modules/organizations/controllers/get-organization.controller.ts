import { BadRequestException, Controller, Get, UseGuards } from '@nestjs/common'
import { OrganizationsService } from '../organizations.service'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from '@/modules/auth/strategies/jwt.strategy'

@Controller('/organizations')
@UseGuards(JwtAuthGuard)
export class GetOrganizationController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get()
  async getOrganization(@CurrentUser() { ctx }: TokenPayload) {
    if (!ctx.orgId) {
      throw new BadRequestException('Missing params')
    }

    const orgId = ctx.orgId

    const organization =
      await this.organizationsService.getOrganizationById(orgId)

    const membership = {
      organization,
      role: ctx.role!,
    }

    return membership
  }
}
