import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
        return await this.cartService.getCart(userId);
    }

    @Post()
    async addToCart(@Body() body: { userId: string; productId: string; quantity: number }) {
        return await this.cartService.addToCart(body.userId, body.productId, body.quantity);
    }

    @Delete(':userId/:productId')
    async removeFromCart(@Param('userId') userId: string, @Param('productId') productId: string) {
        return await this.cartService.removeFromCart(userId, productId);
    }

    @Delete(':userId')
    async clearCart(@Param('userId') userId: string) {
        return await this.cartService.clearCart(userId);
    }
}
