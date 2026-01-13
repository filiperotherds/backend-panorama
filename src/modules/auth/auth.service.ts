import { PrismaService } from '@/database/prisma/prisma.service'
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignInBodySchema } from './schemas/sign-in.schema'
import { compare, hash } from 'bcryptjs'
import { SignUpBodySchema } from './schemas/sign-up.schema'
import { CurrentUser } from '@/common/decorators/current-user-decorator'
import { TokenPayload } from './strategies/jwt.strategy'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async singin({ email, password }: SignInBodySchema) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        member: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const payload = {
      sub: user.id,
      iss: 'panorama.auth',
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }

  async singup({ name, email, password }: SignUpBodySchema) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userExists) {
      throw new ConflictException('User already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
    })
  }

  async getUserMembership(@CurrentUser() { sub }: TokenPayload) {}
}
