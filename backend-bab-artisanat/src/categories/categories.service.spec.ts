import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from '../schemas/category.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('CategoriesService', () => {
  let service: CategoriesService;

  // Mock document class
  class MockCategoryDocument {
    constructor(private data: any) {}
    save = jest.fn().mockResolvedValue({
      _id: '123',
      name: this.data.name,
      toObject: () => ({
        _id: '123',
        name: this.data.name
      })
    });
  }

  // Mock model class
  const mockCategoryModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findByIdAndDelete: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    // Simulate new Model() call
    prototype: {
      save: jest.fn()
    }
  };

  // Mock constructor function
  const mockModelConstructor = function(data) {
    const doc = new MockCategoryDocument(data);
    // Return a plain object when saved
    doc.save.mockResolvedValue({
      _id: '123',
      name: data.name
    });
    return doc;
  };
  Object.assign(mockModelConstructor, mockCategoryModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken(Category.name),
          useValue: mockModelConstructor,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    
    // Reset all mocks between tests
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all categories with a success message', async () => {
      const categories = [{ name: 'Category 1' }, { name: 'Category 2' }];
      mockCategoryModel.exec.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result.message).toBe('Liste des catégories récupérée avec succès');
      expect(result.categories).toEqual(categories);
      expect(mockCategoryModel.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const name = 'New Category';
      const expectedCategory = { _id: '123', name };
      
      mockCategoryModel.exec.mockResolvedValueOnce(null); // For findOne
      
      const result = await service.create(name);

      expect(result.message).toBe('Catégorie créée avec succès');
      expect(result.category).toEqual(expectedCategory);
      expect(mockCategoryModel.findOne).toHaveBeenCalledWith({ name });
    });

    it('should throw ConflictException if category already exists', async () => {
      const name = 'Existing Category';
      mockCategoryModel.exec.mockResolvedValueOnce({ name });

      await expect(service.create(name)).rejects.toThrow(ConflictException);
      await expect(service.create(name)).rejects.toThrow('Cette catégorie existe déjà');
    });
  });

  describe('remove', () => {
    it('should remove a category by id', async () => {
      const id = '123';
      const deletedCategory = { _id: id, name: 'Category 1' };
      
      mockCategoryModel.exec.mockResolvedValue(deletedCategory);

      const result = await service.remove(id);

      expect(result.message).toBe('Catégorie supprimée avec succès');
      expect(mockCategoryModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if category not found', async () => {
      const id = '123';
      mockCategoryModel.exec.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
      await expect(service.remove(id)).rejects.toThrow('Catégorie non trouvée');
    });
  });
});