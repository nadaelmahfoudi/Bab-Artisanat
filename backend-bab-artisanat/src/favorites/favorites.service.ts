import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../schemas/favorite.schema';
import { Product } from '../schemas/product.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async addFavorite(userId: string, productId: string) {
    const productExists = await this.productModel.findById(productId);
    if (!productExists) throw new NotFoundException('Produit non trouvé');

    const alreadyFavorited = await this.favoriteModel.findOne({ user: userId, product: productId });
    if (alreadyFavorited) throw new BadRequestException('Produit déjà ajouté aux favoris');

    const favorite = new this.favoriteModel({ user: userId, product: productId });
    await favorite.save();
    return { message: 'Produit ajouté aux favoris' };
  }

  async removeFavorite(userId: string, productId: string) {
    const favorite = await this.favoriteModel.findOneAndDelete({ user: userId, product: productId });
    if (!favorite) throw new NotFoundException('Ce produit n\'est pas dans vos favoris');
    return { message: 'Produit supprimé des favoris' };
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.favoriteModel.find({ user: userId }).populate('product');
    return { message: 'Liste des favoris récupérée', favorites };
  }
}
