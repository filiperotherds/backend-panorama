import { Controller, Get, UseGuards } from '@nestjs/common'
import { UsersService } from '../users.service'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from '@/modules/auth/strategies/jwt.strategy'

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class GetUserProfileController {
  constructor(private usersService: UsersService) {}

  @Get('/profile')
  async getProfile(@CurrentUser() { sub }: TokenPayload) {
    const user = await this.usersService.getUserProfileById(sub)

    return user
  }
}
