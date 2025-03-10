import { Controller, Post, Delete, Get, Param, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('add')
  async addFavorite(@Body() body: { userId: string; productId: string }) {
    if (!body.userId || !body.productId) throw new BadRequestException('userId and productId are required');
    return this.favoritesService.addFavorite(body.userId, body.productId);
  }

  @Delete('remove')
  async removeFavorite(@Body() body: { userId: string; productId: string }) {
    if (!body.userId || !body.productId) throw new BadRequestException('userId and productId are required');
    return this.favoritesService.removeFavorite(body.userId, body.productId);
  }

  @Get(':userId')
  async getUserFavorites(@Param('userId') userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.favoritesService.getUserFavorites(userId);
  }
}
