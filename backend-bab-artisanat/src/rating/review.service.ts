import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../schemas/review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async createReview(userId: string, productId: string, review: string) {
    const newReview = new this.reviewModel({
      userId,
      productId,
      review,
    });
    return await newReview.save();
  }

  async getReviewsByProduct(productId: string) {
    return this.reviewModel
      .find({ productId })
      .populate('userId', 'name')
      .exec();
  }

  async deleteReview(id: string) {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
