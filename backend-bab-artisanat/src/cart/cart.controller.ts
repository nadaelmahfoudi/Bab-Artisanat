import { Controller, Post, Get, Delete, Patch, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return await this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(@Body() body: { userId: string; productId: string; quantity: number }) {
    return await this.cartService.addToCart(body.userId, body.productId, body.quantity);
  }

  @Delete('remove')
  async removeFromCart(@Body() body: { userId: string; productId: string }) {
    return await this.cartService.removeFromCart(body.userId, body.productId);
  }

  @Delete('clear')
  async clearCart(@Body() body: { userId: string }) {
    return await this.cartService.clearCart(body.userId);
  }

  @Patch('update')
  async updateCartItem(@Body() body: { userId: string; productId: string; quantity: number }) {
    return await this.cartService.updateCartItem(body.userId, body.productId, body.quantity);
  }

  @Post('checkout')
  async createCheckout(@Body() body: { userId: string }) {
    console.log("Received userId:", body.userId);
    if (!body.userId) throw new BadRequestException("userId is required");
    return await this.cartService.createCheckoutSession(body.userId);
  }
  
}
