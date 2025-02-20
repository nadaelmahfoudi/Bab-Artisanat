import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, type: [String] })
    images: string[];

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    stock: number;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
