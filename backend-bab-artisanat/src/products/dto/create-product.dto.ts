import { IsString, IsNotEmpty, IsNumber, IsMongoId, IsArray } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsNotEmpty()
    images: string[];

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsMongoId()
    @IsNotEmpty()
    category: string;

    @IsMongoId()
    @IsNotEmpty()
    userId: string;  
}
