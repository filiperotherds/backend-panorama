import { PrismaService } from '@/database/prisma/prisma.service'
import {
  BadRequestException,
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

type JwtTyp = 'USER' | 'ORG_CLIENT' | 'ORG_PRO'

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
        userProfile: true,
        member: {
          include: {
            organization: {
              include: {
                providerProfile: true,
                clientProfile: true,
              },
            },
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

    let typ: JwtTyp
    let ctx: {
      orgId: string | null
      memberId: string | null
      profileId: string | null
      role?: string
      slug?: string | null
    }

    if (user.accountType === 'INDIVIDUAL') {
      if (!user.userProfile) {
        throw new BadRequestException('Individual account without profile.')
      }

      typ = 'USER'
      ctx = {
        orgId: null,
        memberId: null,
        profileId: user.userProfile.id,
      }
    } else {
      if (!user.member) {
        throw new BadRequestException(
          'Business user has no organization linked.',
        )
      }

      const org = user.member.organization

      if (org.type === 'PROVIDER') {
        if (!org.providerProfile) {
          throw new BadRequestException(
            'Provider Organization missing profile.',
          )
        }

        typ = 'ORG_PRO'
        ctx = {
          orgId: org.id,
          memberId: user.member.id,
          profileId: org.providerProfile.id,
          role: user.member.role,
          slug: org.slug,
        }
      } else {
        if (!org.clientProfile) {
          throw new BadRequestException('Client Organization missing profile.')
        }

        typ = 'ORG_CLIENT'
        ctx = {
          orgId: org.id,
          memberId: user.member.id,
          profileId: org.clientProfile.id,
          role: user.member.role,
          slug: org.slug,
        }
      }
    }

    const payload = {
      sub: user.id,
      typ,
      ctx,
      iss: 'workee.auth',
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }

  async singup({ name, email, password, accountType }: SignUpBodySchema) {
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
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          accountType,
        },
      })

      await tx.userProfile.create({
        data: {
          userId: user.id,
        },
      })
    })
  }

  async organizationSignUp({
    name,
    email,
    password,
    accountType,
    orgType,
  }: SignUpBodySchema) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (userExists) {
      throw new ConflictException('User already exists.')
    }

    if (!orgType) {
      throw new BadRequestException('Organization type is required.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          accountType,
        },
      })

      const organization = await tx.organization.create({
        data: {
          type: orgType,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: 'ADMIN',
            },
          },
        },
      })

      await tx.providerProfile.create({
        data: { organizationId: organization.id },
      })

      // await tx.user.update({
      //   where: { id: user.id },
      //   data: {
      //     organizationOwner: { connect: { id: organization.id } },
      //   },
      // })
    })
  }

  async getUserMembership(@CurrentUser() { sub }: TokenPayload) {
    
  }
}
