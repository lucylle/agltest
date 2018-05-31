import { Component, OnInit } from '@angular/core';
import { PersonModel } from '@app/models/person.model';
import { PetModel } from '@app/models/pet.model';
import { PetService } from '@app/core/services/pet.service';
import { GenderEnum } from '@app/enums/gender.enum';
import { PetTypeEnum } from '@app/enums/pet-type.enum';

@Component({
  selector: 'cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit {
    error: string = null;
    catsByGender: { [index: string]: string[] };
    
    constructor(private petService: PetService) {
    }

    ngOnInit() {
        this.getPetOwners();
    }

    getPetOwners() {
        this.error = null;
        this.petService.getPetsByOwners().subscribe(
            data => { this.catsByGender = this.getCatsByGender(data) },
            error => { this.error = "Uh oh, the cats have gone a wandering and we couldn't grab them at this moment"; },
        );
    }

    getCatsByGender(people: PersonModel[]) {
        // initialise the genders
        const catsByGender = {};
        for (let gender in GenderEnum) {
            if (isNaN(Number(gender))) {
                catsByGender[gender] = new Array<string>();
            }
        }

        if (people) {
            // set the cats by gender
            people.forEach(person => {
                if (person.pets) {
                    person.pets.forEach(pet => {
                        if (pet.type == PetTypeEnum.Cat) {
                            catsByGender[person.gender].push(pet.name);
                        }
                    });
                }
            });

            // sort the cats
            for (let gender of Object.keys(catsByGender)) {
                catsByGender[gender].sort();
            }
        }

        return catsByGender;
    }
}
