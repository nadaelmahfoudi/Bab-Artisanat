import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findProductsByUser: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{
        provide: ProductsService,
        useValue: mockProductsService,
      }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('getProductsByUser', () => {
    it('should return products by userId', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      mockProductsService.findProductsByUser.mockResolvedValue(mockProducts);

      const result = await controller.getProductsByUser('123');

      expect(result).toEqual({ message: 'Produits récupérés avec succès', products: mockProducts });
      expect(service.findProductsByUser).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(controller.getProductsByUser('')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: '1', name: 'Product 1' };
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
        const createProductDto: CreateProductDto = {
            name: 'New Product',
            description: 'A great product',
            images: ['image1.jpg'],
            price: 100,
            stock: 10,
            category: '60d21b4667d0d8992e610c85', 
            userId: '60d21b4867d0d8992e610c86'  
        };        
      const mockProduct = { id: '1', ...createProductDto };
      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const mockProduct = { id: '1', ...updateProductDto };
      mockProductsService.update.mockResolvedValue(mockProduct);

      const result = await controller.update('1', updateProductDto);

      expect(result).toEqual(mockProduct);
      expect(service.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductsService.remove.mockResolvedValue({ message: 'Product deleted' });

      const result = await controller.remove('1');

      expect(result).toEqual({ message: 'Product deleted' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('uploadFile', () => {
    it('should return file URL on upload', () => {
      const mockFile = { filename: 'test.png' };
      const result = controller.uploadFile(mockFile);

      expect(result).toEqual({ imageUrl: 'http://localhost:3000/uploads/test.png' });
    });

    it('should throw BadRequestException if no file is uploaded', () => {
      expect(() => controller.uploadFile(null)).toThrow(BadRequestException);
    });
  });
});