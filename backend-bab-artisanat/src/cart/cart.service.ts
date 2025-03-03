import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schemas/cart.schema';
import { Product } from '../schemas/product.schema'; // Import du modèle Product

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  // 🔹 Récupérer le panier d'un utilisateur
  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('items.productId') // Charger les détails des produits
      .exec();

    if (!cart) {
      throw new NotFoundException('Panier non trouvé');
    }
    return cart;
  }

  // 🔹 Ajouter un produit au panier
  async addToCart(userId: string, productId: string, quantity: number) {
    let cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) }).exec();

    if (!cart) {
      cart = new this.cartModel({
        user: new Types.ObjectId(userId),
        items: [],
        total: 0,
      });
    }

    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    const productObjectId = new Types.ObjectId(productId); // Assurer un ObjectId valide

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productObjectId));

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: productObjectId, // Assurer un ObjectId valide
        name: product.name,
        image: product.images?.[0] || '', // Vérifier si `images` existe
        price: product.price,
        quantity,
      });
    }

    cart.total = this.calculateTotal(cart);
    await cart.save();
    return { message: 'Produit ajouté au panier', cart };
  }

  // 🔹 Supprimer un produit du panier
  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) }).exec();
    if (!cart) {
      throw new NotFoundException('Panier non trouvé');
    }

    const productObjectId = new Types.ObjectId(productId); // Correction du type
    cart.items = cart.items.filter(item => !item.productId.equals(productObjectId));

    cart.total = this.calculateTotal(cart);
    await cart.save();

    return { message: 'Produit retiré du panier', cart };
  }

  // 🔹 Vider entièrement le panier
  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) }).exec();
    if (!cart) {
      throw new NotFoundException('Panier non trouvé');
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    return { message: 'Panier vidé', cart };
  }

  // 🔹 Mettre à jour la quantité d'un produit dans le panier
  async updateCartItem(userId: string, productId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user: new Types.ObjectId(userId) }).exec();
    if (!cart) {
      throw new NotFoundException('Panier non trouvé');
    }

    const productObjectId = new Types.ObjectId(productId); // Correction du type
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productObjectId));

    if (itemIndex === -1) {
      throw new NotFoundException('Produit non trouvé dans le panier');
    }

    if (quantity > 0) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.splice(itemIndex, 1); // Supprime l'élément si la quantité est 0
    }

    cart.total = this.calculateTotal(cart);
    await cart.save();

    return { message: 'Quantité mise à jour', cart };
  }

  // 🔹 Calculer le total du panier
  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
