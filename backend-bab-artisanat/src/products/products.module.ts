import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from '../schemas/product.schema';
import { CategoriesModule } from '../categories/categories.module';
import { RatingModule } from '../rating/rating.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), RatingModule, CategoriesModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
