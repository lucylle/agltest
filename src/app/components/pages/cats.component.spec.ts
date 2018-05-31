import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { flatten } from '@angular/compiler';
import { HttpErrorResponse } from '@angular/common/http';
import { CatsComponent } from './cats.component';
import { KeysPipe } from '@app/core/pipes/keys.pipe';
import { PetService } from '@app/core/services/pet.service';
import { PersonModel } from '@app/models/person.model';
import { GenderEnum } from '@app/enums/gender.enum';
import { PetTypeEnum } from '@app/enums/pet-type.enum';

describe('CatsComponent', () => {
    let component: CatsComponent;
    let fixture: ComponentFixture<CatsComponent>;
    let petServiceSpy: jasmine.SpyObj<PetService>;
    let petOwnersSpy: jasmine.Spy;

    beforeEach(async(() => {
        petServiceSpy = jasmine.createSpyObj('PetService', ['getPetsByOwners']);

        TestBed.configureTestingModule({
        declarations: [ CatsComponent, KeysPipe ],
        providers: [
            { provide: PetService, useValue: petServiceSpy }
        ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CatsComponent);
        component = fixture.componentInstance;
    });

    it('should create component', () => {
        expect(component).toBeDefined();
    });

    it('after component init should call PetService.getPetsByOwners and set/display cats', () => {
        const petOwners = getPetOwners();
        const expectedCats = getExpectedCatsByGender();
        const genders = Object.keys(GenderEnum).filter(g => isNaN(Number(g)));
        petOwnersSpy = petServiceSpy.getPetsByOwners.and.returnValue(of(petOwners));
        
        // test the method
        fixture.detectChanges(); // triggers onInit

        // check it called the pet service
        expect(petOwnersSpy.calls.count()).toBe(1);

        // check the cat list field is set
        expect(component.catsByGender).toBeDefined();
        genders.forEach(g => {
            expect(component.catsByGender[g]).toBeDefined();
            expect(component.catsByGender[g].length).toBe(expectedCats[g].length);
            expect((component.catsByGender[g] as string[]).every(x => x.startsWith('Cat'))).toBeTruthy();
        });

        // check the html cat list is set
        const catListDiv = fixture.nativeElement.querySelector('.pet-list');
        let genderNodes = fixture.nativeElement.querySelectorAll('.pet-list h2') as NodeList;
        let catNodes = fixture.nativeElement.querySelectorAll('.pet-list li') as NodeList;
        expect(catListDiv).toBeDefined();
        expect(genderNodes).toBeDefined();
        expect(catNodes).toBeDefined();
        expect(genderNodes.length).toBe(genders.length);

        let catIndex = 0;
        for (let i = 0; i < genders.length; i++) {
            var gender = genders[i];
            expect(genderNodes[i].textContent).toBe(gender);
            for (let j = 0; j < expectedCats[gender].length; j++, catIndex++) {
                expect(catNodes[catIndex].textContent).toBe(expectedCats[gender][j]);
            }
        }
        expect(catNodes.length).toBe(catIndex);

        // check the errors are empty
        expect(component.error).toBeNull();

        // check the error html is blank
        const errorDiv = fixture.nativeElement.querySelector('.error');
        expect(errorDiv).toBeNull();
    });

    it('getPetOwners when errors sets error message', () => {
        const errorResponse = new HttpErrorResponse({ error: "internal server error", status: 400 });
        petOwnersSpy = petServiceSpy.getPetsByOwners.and.returnValue(throwError(errorResponse));

        // test the method
        fixture.detectChanges(); // triggers onInit

        // check it called the pet service
        expect(petOwnersSpy.calls.count()).toBe(1);

        // check the cat list field and div is not set
        const catListDiv = fixture.nativeElement.querySelector('.pet-list');
        expect(component.catsByGender).toBeUndefined();
        expect(catListDiv).toBeNull();

        // check the error isn't empty and is displayed
        const errorDiv = fixture.nativeElement.querySelector('.error');
        expect(component.error).toBeDefined();
        expect(errorDiv).toBeDefined();
        expect(errorDiv.textContent).toBe(component.error);
    });

    it ('getCatsByGender when data null creates genders and no cats', () => {
        const catData = null;
        const genders = Object.keys(GenderEnum).filter(g => isNaN(Number(g)));

        // test the method
        const result = component.getCatsByGender(catData);

        // expectations
        expect(result).toBeDefined();
        
        // the expected genders with empty cat arrays
        genders.forEach(g => {
            expect(result[g]).toBeDefined();
            expect(result[g].length).toBe(0);
        });
    });

    it('getCatsByGender creates genders and filters cats', () => {
        const petOwners = getPetOwners();
        const expectedCats = getExpectedCatsByGender();
        const genders = Object.keys(GenderEnum).filter(g => isNaN(Number(g)));

        // test the method
        const result = component.getCatsByGender(petOwners);

        // expectations
        expect(result).toBeDefined();
        
        // the expected genders with empty cat arrays
        genders.forEach(g => {
            expect(result[g]).toBeDefined();
            expect(result[g].length).toBe(expectedCats[g].length);
            expect((result[g] as string[]).every(x => x.startsWith('Cat'))).toBeTruthy();
        });
    });
 
    let getPetOwners = () => {
        return [{
            name: 'P1', gender: GenderEnum.Female, age: 20, pets: [
                { name: 'Cat 1', type: PetTypeEnum.Cat },
                { name: 'Dog 1', type: PetTypeEnum.Dog }
            ]},{
            name: 'P2', gender: GenderEnum.Female, age: 20, pets: [
                { name: 'Cat 2', type: PetTypeEnum.Cat },
                { name: 'Dog 2', type: PetTypeEnum.Dog }
            ]},{
            name: 'P3', gender: GenderEnum.Male, age: 20, pets: [
                { name: 'Cat 3', type: PetTypeEnum.Cat },
                { name: 'Fish 3', type: PetTypeEnum.Fish }
            ]}
        ];
    }

    let getExpectedCatsByGender = () => {
        return {
            'Female': ['Cat 1', 'Cat 2'],
            'Male': ['Cat 3']
        }
    }
});