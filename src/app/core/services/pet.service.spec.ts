import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import { PetService } from "@app/core/services/pet.service";
import { DataService } from "@app/core/services/data.service";
import { PersonModel } from "@app/models/person.model";


describe('PetService unit tests', () => {
    let petService : PetService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;

    beforeEach(() => {
        // set up the modules
        const spy = jasmine.createSpyObj('DataService', ['getData']);
        TestBed.configureTestingModule({
            providers: [
                PetService,
               { provide: DataService, useValue: spy }
            ]
        });

        // inject the services
        petService = TestBed.get(PetService);
        dataServiceSpy = TestBed.get(DataService);
    });

    it('getPetsByOwners calls dataService and returns observable', () => {
        const stubResult = new Observable<PersonModel[]>();
        dataServiceSpy.getData.and.returnValue(stubResult);

        // test the method
        const result = petService.getPetsByOwners();

        // expectations
        expect(dataServiceSpy.getData.calls.count()).toBe(1);
        expect(dataServiceSpy.getData).toHaveBeenCalledWith('people.json');
        expect(result).toEqual(stubResult);
    });
});