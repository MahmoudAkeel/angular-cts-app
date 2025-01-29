import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private baseUrl = 'https://iam-qatar.d-intalio.com/api';

    constructor(private http: HttpClient) { }

    searchUsers(searchText: string = '', language: string = 'en'): Observable<User[]> {
        const params = new HttpParams()
            .set('text', searchText)
            .set('language', language);

        return this.http.get<User[]>(`${this.baseUrl}/SearchUsers`, { params })
            .pipe(
                map(response => Array.isArray(response) ? response : [])
            );
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/Users/${id}`);
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/Users/Current`);
    }
} 