import { Injectable } from '@angular/core';
import { DataService } from '@app/core/services/data.service';
import { PersonModel } from '@app/models/person.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class PetService {
    constructor(private dataService: DataService) {
    }

    public getPetsByOwners() : Observable<PersonModel[]> {
        return this.dataService.getData<PersonModel[]>('people.json');
    }
}