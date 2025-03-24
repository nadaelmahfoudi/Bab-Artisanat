import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const result = ['category1', 'category2'];
      mockCategoriesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const name = 'New Category';
      const result = { id: '123', name };

      mockCategoriesService.create.mockResolvedValue(result);

      expect(await controller.create(name)).toBe(result);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(name);
    });
  });

  describe('remove', () => {
    it('should remove a category by id', async () => {
      const id = '123';
      const result = { id };

      mockCategoriesService.remove.mockResolvedValue(result);

      expect(await controller.remove(id)).toBe(result);
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
