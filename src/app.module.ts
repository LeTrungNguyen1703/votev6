import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PollModule } from './poll/poll.module';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [CatsModule, PrismaModule, UserModule, PollModule, VoteModule],
})
export class AppModule {}
