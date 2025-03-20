import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from '../schemas/cart.schema';
import { Product, ProductSchema } from '../schemas/product.schema';
import { NotificationModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Product.name, schema: ProductSchema },
    ]),NotificationModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], 
})
export class CartModule {}
