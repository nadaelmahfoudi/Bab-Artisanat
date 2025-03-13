import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from '../schemas/rating.schema';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
  ) {}

  async createRating(userId: string, productId: string, rating: number, review?: string) {
    const newRating = new this.ratingModel({
      userId,
      productId,
      rating,
      review,
    });
    return await newRating.save();
  }
}
