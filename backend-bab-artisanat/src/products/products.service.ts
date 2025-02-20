import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { Category } from '../schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
      @InjectModel(Product.name) private productModel: Model<Product>, 
      @InjectModel(Category.name) private categoryModel: Model<Category>
    ) {}

    async findAll(): Promise<{ message: string; products: Product[] }> {
        const products = await this.productModel.find().populate('category').exec();
        return { message: 'Liste des produits récupérée avec succès', products };
    }
    
    async findOne(id: string): Promise<{ message: string; product: Product }> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new BadRequestException('ID invalide');
        }
        const product = await this.productModel.findById(id).populate('category').exec();
        if (!product) throw new NotFoundException('Produit non trouvé');
        return { message: 'Produit récupéré avec succès', product };
    }
    

    async create(createProductDto: CreateProductDto): Promise<{ message: string; product: Product }> {
        const { category } = createProductDto;
        
        // Vérifie si la catégorie existe
        const categoryExists = await this.categoryModel.findById(category).exec();
        if (!categoryExists) {
            throw new NotFoundException('Catégorie non trouvée');
        }
    
        const newProduct = new this.productModel(createProductDto);
        const savedProduct = await newProduct.save();
        return { message: 'Produit créé avec succès', product: savedProduct };
    }


    async update(id: string, updateProductDto: UpdateProductDto): Promise<{ message: string; product: Product }> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new BadRequestException('ID invalide');
        }
    
        if (updateProductDto.category) {
            const categoryExists = await this.categoryModel.findById(updateProductDto.category).exec();
            if (!categoryExists) {
                throw new NotFoundException('Catégorie non trouvée');
            }
        }
    
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
        if (!updatedProduct) throw new NotFoundException('Produit non trouvé');
    
        return { message: 'Produit mis à jour avec succès', product: updatedProduct };
    }
    
    async remove(id: string): Promise<{ message: string }> {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new BadRequestException('ID invalide');
        }
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) throw new NotFoundException('Produit non trouvé');
        return { message: 'Produit supprimé avec succès' };
    }
}
