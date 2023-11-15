import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Delete } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
    ){
  }


  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } 
    catch (error) {
      if  (error.code === 11000){
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - check server log`);
    }
  }


  
  findAll() {
    return `This action returns all pokemon`;
  }


  

  // asincrono es para buscar a la base de datos
  async findOne(id: string) {

    let pokemon : Pokemon;

    if (!isNaN(+id)){
      pokemon = await this.pokemonModel.findOne({ no: id});
    }

    // mongo id 
    if ( !pokemon && isValidObjectId (id)){
      pokemon = await this.pokemonModel.findById(id);
    }

    // name 
    // tim = elimina espacio adelante y atras
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name:id.toLowerCase().trim()});
    }

    if(pokemon)
      return pokemon;
    throw new NotFoundException(`no existe`);
  }




  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id);

    if (updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleexceptions(error);
    }
    

    
  }



  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id : id});
    if( deletedCount === 0){
      throw new BadRequestException(`No se encontro ningun pokemon con el id: "${id}"`)
    }
    return;
  }


  private handleexceptions(error : any){
  if  (error.code === 11000){
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - check server log`);
  }
}
