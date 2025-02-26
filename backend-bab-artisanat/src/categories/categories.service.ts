import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

    async findAll(): Promise<{ message: string; categories: Category[] }> {
        const categories = await this.categoryModel.find().exec();
        return { message: 'Liste des catégories récupérée avec succès', categories };
    }

    async create(name: string): Promise<{ message: string; category: Category }> {
        const existingCategory = await this.categoryModel.findOne({ name }).exec();
        if (existingCategory) throw new ConflictException('Cette catégorie existe déjà');

        const newCategory = new this.categoryModel({ name });
        const savedCategory = await newCategory.save();
        return { message: 'Catégorie créée avec succès', category: savedCategory };
    }

    async remove(id: string): Promise<{ message: string }> {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!deletedCategory) throw new NotFoundException('Catégorie non trouvée');

        return { message: 'Catégorie supprimée avec succès' };
    }
}
