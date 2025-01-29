import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Priority } from '../models/priority.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  private listUsersUrl = 'https://iam-qatar.d-intalio.com/api/SearchUsersByStructureIds';
  private listPrivacies = 'https://cts-qatar.d-intalio.com/Privacy/ListPrivacies';
  private listCategories = 'https://cts-qatar.d-intalio.com/Category/ListCategories';

  constructor(private http: HttpClient) { }

  getPrivacyOptions(): Observable<any[]> {
    // Replace with actual API call
    const privacyOptions = [
      { id: 1, name: 'Normal' },
      { id: 2, name: 'Confidential' },
      { id: 3, name: 'High Confidential' }
    ];
    return of(privacyOptions);
  }

  getPriorityOptions(): Observable<Priority[]> {
    return this.http.get<Priority[]>('https://cts-qatar.d-intalio.com/Priority/ListPriorities');
  }


  getUsers(accessToken: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });

    const formData = new FormData();
    formData.append('ids[]', JSON.stringify(1));
    formData.append('text', '');
    formData.append('language', '');
    formData.append('showOnlyActiveUsers', 'true');


    return this.http.post(this.listUsersUrl, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error while fetching users data', error.message);
          throw error;
        })
      );
  }

  getPrivacy(accessToken: string): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(this.listPrivacies, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error while fetching privacies data', error.message);
          throw error;
        })
      );
  }

  getCategories(accessToken: string, delegationId: string | undefined): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    let params = new HttpParams();
    if (delegationId !== undefined) {
      params = params.set('delegationId', delegationId);
    }

    return this.http.get(this.listCategories, { headers, params })
      .pipe(
        catchError((error) => {
          console.error('Error while fetching categories data', error.message);
          throw error;
        })
      );
  }


}
