import { IsInt, IsPositive, IsString, Min, MinLength } from  'class-validator';

export class CreatePokemonDto {


    @IsPositive()
    @IsInt()
    @Min(1)
    no : number;

    @IsString()
    @MinLength(2)
    name : string;
}
