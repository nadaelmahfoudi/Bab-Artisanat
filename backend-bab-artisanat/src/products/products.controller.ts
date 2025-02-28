import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }
    
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }    

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + extname(file.originalname));
            }
        })
    }))
    uploadFile(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('Aucune image téléchargée');
        }
        return { imageUrl: `http://localhost:3000/uploads/${file.filename}` };
    }
    
}
