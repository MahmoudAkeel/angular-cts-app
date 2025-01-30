import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private baseUrl = 'https://cts-qatar.d-intalio.com';

    constructor(private http: HttpClient) { }

    ListCategories(delegationId: string = ''): Observable<Category[]> {
        debugger
        const params = new HttpParams()
            .set('delegationId',delegationId )

        // return this.http.get<Category[]>(`${this.baseUrl}/Category/ListCategories`, { params })
        //     .pipe(
        //         map(response => Array.isArray(response) ? response : [])
                
        //     );
        return this.http.get<Category[]>(`${this.baseUrl}/Category/ListCategories`, { params })
        .pipe(
            map(response => Array.isArray(response) ? response : []) // Process the response
        );
    }

   
} 