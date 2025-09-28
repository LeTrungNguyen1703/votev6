import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatsService } from './cats/cats.service';
import { CatsModule } from './cats/cats.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PollService } from './poll/poll.service';
import { VoteService } from './vote/vote.service';
import { PollModule } from './poll/poll.module';
import { VoteModule } from './vote/vote.module';

// Mounting the application as bare Nest standalone application so that we can use
// the Nest services inside our Encore endpoints
const applicationContext: Promise<{
  catsService: CatsService,
  userService: UserService,
  pollService: PollService,
  voteService: VoteService,
}> =
  NestFactory.createApplicationContext(AppModule).then((app) => {
    return {
      catsService: app.select(CatsModule).get(CatsService, { strict: true }),
      userService: app.select(UserModule).get(UserService, { strict: true }),
      pollService: app.select(PollModule).get(PollService, { strict: true }),
      voteService: app.select(VoteModule).get(VoteService, { strict: true }),
    };
  });

export default applicationContext;
