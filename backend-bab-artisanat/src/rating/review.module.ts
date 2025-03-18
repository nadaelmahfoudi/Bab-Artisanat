import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from '../schemas/review.schema';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [MongooseModule],
})
export class ReviewModule {}
