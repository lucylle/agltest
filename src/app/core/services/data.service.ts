import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';

@Injectable()
export class DataService {

    constructor(private http: HttpClient) {}

    public getData<T>(url: string) : Observable<T> {
        const fullUrl = this.getFullUrl(url);
        return this.http.get<T>(fullUrl);
    }

    protected getFullUrl(relativeUrl: string) {
        return `${environment.apiUrl}/${relativeUrl}`;
    }
}