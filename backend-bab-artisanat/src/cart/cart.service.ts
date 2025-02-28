import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schemas/cart.schema';
import { Product } from '../schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // 🛒 Récupérer le panier d'un utilisateur
  async getCart(userId: string): Promise<{ message: string; cart: Cart }> {
    const cart = await this.cartModel.findOne({ user: userId }).populate('items.productId').exec();
    if (!cart) throw new NotFoundException('Panier non trouvé');
    return { message: 'Panier récupéré avec succès', cart };
  }

  // ➕ Ajouter un produit au panier
  async addToCart(userId: string, productId: string, quantity: number): Promise<{ message: string; cart: Cart }> {
    if (!quantity || quantity < 1) throw new BadRequestException('Quantité invalide');

    let cart = await this.cartModel.findOne({ user: userId }).exec();
    const product = await this.productModel.findById(productId).exec();
    if (!product) throw new NotFoundException('Produit non trouvé');

    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    const productObjectId = new Types.ObjectId(productId);
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productObjectId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId: productObjectId, quantity, price: product.price });
    }

    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const updatedCart = await cart.save();

    return { message: 'Produit ajouté au panier', cart: updatedCart };
  }

  // ❌ Supprimer un produit du panier
  async removeFromCart(userId: string, productId: string): Promise<{ message: string; cart: Cart }> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) throw new NotFoundException('Panier non trouvé');

    const productObjectId = new Types.ObjectId(productId);
    cart.items = cart.items.filter(item => !item.productId.equals(productObjectId));

    cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const updatedCart = await cart.save();

    return { message: 'Produit retiré du panier', cart: updatedCart };
  }

  // 🗑️ Vider le panier
  async clearCart(userId: string): Promise<{ message: string }> {
    await this.cartModel.findOneAndDelete({ user: userId }).exec();
    return { message: 'Panier vidé avec succès' };
  }
}
