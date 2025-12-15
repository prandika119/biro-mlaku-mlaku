import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TripModule } from './trip/trip.module';

@Module({
  imports: [CommonModule, UserModule, TripModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
