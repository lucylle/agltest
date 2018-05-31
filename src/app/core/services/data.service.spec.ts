import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { environment } from '@app/../environments/environment';

describe('DataService unit tests', () => {
    let dataService: DataService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // set up the modules
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [ DataService ]
        });

        // inject the service and test controller for each test
        dataService = TestBed.get(DataService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('getData<T> makes http get request with correct URL', () => {
        const testData: string = "test response";
        const testUrl: string = "test-url";
        let result: string;

        // test the method
        dataService.getData<string>(testUrl).subscribe(data => result = data);

        // the correct call was made
        const fullUrl = `${environment.apiUrl}/${testUrl}`;
        const req = httpTestingController.expectOne(fullUrl);
        expect(req.request.method).toEqual('GET');
        
        // correct data was returned
        req.flush(testData);
        expect(result).toEqual(testData);
    })

    afterEach(() => {
        // make sure there are no more pending requests
        httpTestingController.verify(); // no more requests
    });
});