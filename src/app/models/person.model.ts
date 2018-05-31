import { GenderEnum } from "@app/enums/gender.enum";
import { PetModel } from "@app/models/pet.model";

export class PersonModel {
    public name: string;
    public gender: GenderEnum;
    public age: number;
    public pets: PetModel[];
}