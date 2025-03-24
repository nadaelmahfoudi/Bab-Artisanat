import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { Category } from '../schemas/category.schema';
import { Review } from '../schemas/review.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  class MockProductDocument {
    constructor(private data: any) {}
    save = jest.fn().mockImplementation(function() {
      return Promise.resolve({
        ...this.data,
        _id: '123',
        toObject: () => ({
          ...this.data,
          _id: '123'
        })
      });
    });
  }

  const mockProductMethods = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    findByIdAndUpdate: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn()
  };

  const mockCategoryModel = {
    findById: jest.fn().mockReturnThis(),
    exec: jest.fn()
  };

  const mockReviewModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn()
  };

  function MockProductModel(data) {
    const document = new MockProductDocument(data);
    Object.assign(document, mockProductMethods);
    return document;
  }
  Object.assign(MockProductModel, mockProductMethods);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: MockProductModel,
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
        {
          provide: getModelToken(Review.name),
          useValue: mockReviewModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products with success message', async () => {
      const mockProducts = [
        { name: 'Product 1', price: 100 },
        { name: 'Product 2', price: 200 }
      ];
      mockProductMethods.exec.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(result.message).toBe('Liste des produits récupérée avec succès');
      expect(result.products).toEqual(mockProducts);
      expect(mockProductMethods.find).toHaveBeenCalled();
      expect(mockProductMethods.populate).toHaveBeenCalledWith('category');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'Product description',
        images: ['image1.jpg', 'image2.jpg'],
        price: 100,
        stock: 10,
        category: '507f1f77bcf86cd799439011',
        userId: 'user123'
      };
      const mockCategory = { _id: '507f1f77bcf86cd799439011', name: 'Category' };

      mockCategoryModel.exec.mockResolvedValue(mockCategory);
      
      const result = await service.create(createProductDto);

      expect(result.message).toBe('Produit créé avec succès');
      expect(result.product).toEqual(expect.objectContaining({
        ...createProductDto,
        _id: '123'
      }));
      expect(mockCategoryModel.findById).toHaveBeenCalledWith(createProductDto.category);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'Product description',
        images: ['image1.jpg'],
        price: 100,
        stock: 10,
        category: 'invalid-category',
        userId: 'user123'
      };

      mockCategoryModel.exec.mockResolvedValue(null);

      await expect(service.create(createProductDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(createProductDto)).rejects.toThrow('Catégorie non trouvée');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 150
      };
      const updatedProduct = { ...updateProductDto, _id: id };

      mockProductMethods.exec.mockResolvedValue(updatedProduct);

      const result = await service.update(id, updateProductDto);

      expect(result.message).toBe('Produit mis à jour avec succès');
      expect(result.product).toEqual(updatedProduct);
      expect(mockProductMethods.findByIdAndUpdate).toHaveBeenCalledWith(id, updateProductDto, { new: true });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = 'invalid-id';
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };

      await expect(service.update(invalidId, updateProductDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(invalidId, updateProductDto)).rejects.toThrow('ID invalide');
    });

    it('should throw NotFoundException if product not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };

      mockProductMethods.exec.mockResolvedValue(null);

      await expect(service.update(id, updateProductDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(id, updateProductDto)).rejects.toThrow('Produit non trouvé');
    });

    it('should validate category if provided in update', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        category: '507f1f77bcf86cd799439012'
      };
      const mockCategory = { _id: '507f1f77bcf86cd799439012', name: 'New Category' };
      const updatedProduct = { ...updateProductDto, _id: id };

      mockCategoryModel.exec.mockResolvedValueOnce(mockCategory);
      mockProductMethods.exec.mockResolvedValueOnce(updatedProduct);

      const result = await service.update(id, updateProductDto);

      expect(result.message).toBe('Produit mis à jour avec succès');
      expect(mockCategoryModel.findById).toHaveBeenCalledWith(updateProductDto.category);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const id = '507f1f77bcf86cd799439011';
      const deletedProduct = { _id: id, name: 'Product to delete' };

      mockProductMethods.exec.mockResolvedValue(deletedProduct);

      const result = await service.remove(id);

      expect(result.message).toBe('Produit supprimé avec succès');
      expect(mockProductMethods.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = 'invalid-id';

      await expect(service.remove(invalidId)).rejects.toThrow(BadRequestException);
      await expect(service.remove(invalidId)).rejects.toThrow('ID invalide');
    });

    it('should throw NotFoundException if product not found', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockProductMethods.exec.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow('Produit non trouvé');
    });
  });

  describe('findOne', () => {
    it('should find a product with reviews', async () => {
      const id = '507f1f77bcf86cd799439011';
      const mockProduct = { _id: id, name: 'Product', category: 'category-id' };
      const mockReviews = [{ _id: '1', rating: 5 }, { _id: '2', rating: 4 }];

      mockProductMethods.exec.mockResolvedValueOnce(mockProduct);
      mockReviewModel.exec.mockResolvedValueOnce(mockReviews);

      const result = await service.findOne(id);

      expect(result.message).toBe('Produit récupéré avec succès');
      expect(result.product).toEqual(mockProduct);
      expect(result.reviews).toEqual(mockReviews);
      expect(mockProductMethods.findById).toHaveBeenCalledWith(id);
      expect(mockProductMethods.populate).toHaveBeenCalledWith('category');
      expect(mockReviewModel.find).toHaveBeenCalledWith({ productId: id });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = 'invalid-id';

      await expect(service.findOne(invalidId)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(invalidId)).rejects.toThrow('ID invalide');
    });

    it('should throw NotFoundException if product not found', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockProductMethods.exec.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow('Produit non trouvé');
    });
  });

  describe('findProductsByUser', () => {
    it('should find products by user ID', async () => {
      const userId = 'user123';
      const mockProducts = [
        { _id: '1', name: 'Product 1', userId },
        { _id: '2', name: 'Product 2', userId }
      ];

      mockProductMethods.exec.mockResolvedValue(mockProducts);

      const result = await service.findProductsByUser(userId);

      expect(result).toEqual(mockProducts);
      expect(mockProductMethods.find).toHaveBeenCalledWith({ userId });
      expect(mockProductMethods.populate).toHaveBeenCalledWith('category', 'name');
    });
  });
});