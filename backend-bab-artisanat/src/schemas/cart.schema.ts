import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Cart extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({
    type: [{ productId: Types.ObjectId, quantity: Number, price: Number }],
    default: [],
  })
  items: { productId: Types.ObjectId; quantity: number; price: number }[];

  @Prop({ default: 0 })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
