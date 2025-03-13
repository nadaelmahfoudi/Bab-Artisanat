import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

@Schema({ timestamps: true })
export class Rating extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  rating: number;

  @Prop({ required: false })
  review: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
