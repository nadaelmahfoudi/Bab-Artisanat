// rating.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('rate')
  async createRating(
    @Body() body: { userId: string, productId: string, rating: number, review?: string },
  ) {
    return await this.ratingService.createRating(
      body.userId,
      body.productId,
      body.rating,
      body.review,
    );
  }
}
