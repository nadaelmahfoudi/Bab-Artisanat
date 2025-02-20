import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    async findAll() {
        return this.categoriesService.findAll();
    }

    @Post()
    async create(@Body('name') name: string) {
        return this.categoriesService.create(name);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
