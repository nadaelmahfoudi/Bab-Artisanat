import { IsString, IsNotEmpty, IsArray, IsNumber, IsMongoId, ArrayNotEmpty } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true }) // Assure que chaque élément est une string
    images: string[];

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number;

    @IsMongoId()
    category: string;
}
