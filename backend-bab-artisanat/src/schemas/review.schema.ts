import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) 
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: false })
  review: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
