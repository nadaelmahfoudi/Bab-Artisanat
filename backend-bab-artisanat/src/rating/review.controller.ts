import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(
    @Body() body: { userId: string, productId: string, review: string },
  ) {
    return await this.reviewService.createReview(
      body.userId,
      body.productId,
      body.review,
    );
  }

  @Get(':productId')
  async getReviewsByProduct(@Param('productId') productId: string) {
    return await this.reviewService.getReviewsByProduct(productId);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return await this.reviewService.deleteReview(id);
  }
}
