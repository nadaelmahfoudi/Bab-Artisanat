import { 
    Controller, 
    Post, 
    Get, 
    Delete, 
    Patch, 
    Param, 
    Body, 
    NotFoundException 
  } from '@nestjs/common';
  import { CartService } from './cart.service';
  
  @Controller('cart')
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    // 🔹 Récupérer le panier d'un utilisateur
    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
      return await this.cartService.getCart(userId);
    }
  
    // 🔹 Ajouter un produit au panier
    @Post('add')
    async addToCart(@Body() body: { userId: string; productId: string; quantity: number }) {
      return await this.cartService.addToCart(body.userId, body.productId, body.quantity);
    }
  
    // 🔹 Supprimer un produit du panier
    @Delete('remove')
    async removeFromCart(@Body() body: { userId: string; productId: string }) {
      return await this.cartService.removeFromCart(body.userId, body.productId);
    }
  
    // 🔹 Vider entièrement le panier
    @Delete('clear')
    async clearCart(@Body() body: { userId: string }) {
      return await this.cartService.clearCart(body.userId);
    }
  
    // 🔹 Mettre à jour la quantité d'un produit dans le panier
    @Patch('update')
    async updateCartItem(@Body() body: { userId: string; productId: string; quantity: number }) {
      return await this.cartService.updateCartItem(body.userId, body.productId, body.quantity);
    }
  }
  