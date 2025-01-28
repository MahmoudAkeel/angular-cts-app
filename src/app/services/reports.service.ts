import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { InprogressReport } from '../models/inprogress-report.model';
import { InprogressCorrespondence } from '../models/inprogress-correspondence.model';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    private baseUrl = 'https://cts-qatar.d-intalio.com';

    constructor(private http: HttpClient) { }

    listInProgressTransfers(params?: {
        structureIds?: number[],
        userIds?: number[],
        fromDate?: string,
        toDate?: string,
        isOverdue?: boolean,
        page?: number,
        pageSize?: number
    }): Observable<ApiResponse<InprogressReport[]>> {
        const formData = new FormData();
        formData.append('draw', '1');
        formData.append('start', params?.page ? ((params.page - 1) * 10).toString() : '0');
        formData.append('length', '10');

        if (params) {
            if (params.structureIds?.length) {
                formData.append('StructureIds', params.structureIds.join(','));
            }
            if (params.userIds?.length) {
                formData.append('UserIds', params.userIds.join(','));
            }
            if (params.fromDate) {
                formData.append('FromDate', params.fromDate);
            }
            if (params.toDate) {
                formData.append('ToDate', params.toDate);
            }
            if (params.isOverdue !== undefined) {
                formData.append('Overdue', params.isOverdue.toString());
            }
        }

        console.log('FormData entries:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        return this.http.post<ApiResponse<InprogressReport[]>>(
            `${this.baseUrl}/Report/ListInProgressTransfers`,
            formData
        );
    }

    listCompletedTransfers(params?: {
        structureIds?: number[],
        userIds?: number[],
        fromDate?: string,
        toDate?: string,
        isOverdue?: boolean,
        page?: number,
        pageSize?: number
    }): Observable<ApiResponse<InprogressReport[]>> {
        const formData = new FormData();
        formData.append('draw', '1');
        formData.append('start', params?.page ? ((params.page - 1) * 10).toString() : '0');
        formData.append('length', '10');

        if (params) {
            if (params.structureIds?.length) {
                formData.append('StructureIds', params.structureIds.join(','));
            }
            if (params.userIds?.length) {
                formData.append('UserIds', params.userIds.join(','));
            }
            if (params.fromDate) {
                formData.append('FromDate', params.fromDate);
            }
            if (params.toDate) {
                formData.append('ToDate', params.toDate);
            }
            if (params.isOverdue !== undefined) {
                formData.append('Overdue', params.isOverdue.toString());
            }
        }

        console.log('FormData entries:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        return this.http.post<ApiResponse<InprogressReport[]>>(
            `${this.baseUrl}/Report/ListInProgressCorrespondences`,
            formData
        );
    }

    listInProgressCorrespondences(params: any): Observable<ApiResponse<InprogressCorrespondence[]>> {
        const formData = new FormData();
        formData.append('draw', '1');
        formData.append('start', params?.page ? ((params.page - 1) * params.pageSize).toString() : '0');
        formData.append('length', params?.pageSize ? params.pageSize.toString() : '10');

        if (params?.structureIds?.length) {
            formData.append('StructureIds', params.structureIds.join(','));
        }
        if (params?.userIds?.length) {
            formData.append('UserIds', params.userIds.join(','));
        }
        if (params?.fromDate) {
            formData.append('FromDate', params.fromDate);
        }
        if (params?.toDate) {
            formData.append('ToDate', params.toDate);
        }
        if (params?.isOverdue !== undefined) {
            formData.append('Overdue', params.isOverdue.toString());
        }
        if (params?.privacyId !== null && params?.privacyId !== undefined) {
            formData.append('PrivacyId', params.privacyId.toString());
        }
        if (params?.priorityId !== null && params?.priorityId !== undefined) {
            formData.append('PriorityId', params.priorityId.toString());
        }

        console.log('FormData entries:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        return this.http.post<ApiResponse<InprogressCorrespondence[]>>(
            `${this.baseUrl}/Report/ListInProgressCorrespondences`,
            formData
        );
    }

    listCompletedCorrespondences(params?: {
        structureIds?: number[],
        userIds?: number[],
        fromDate?: string,
        toDate?: string,
        isOverdue?: boolean,
        privacyId?: number,
        priorityId?: number,
        page?: number,
        pageSize?: number
    }): Observable<ApiResponse<InprogressCorrespondence[]>> {
        const formData = new FormData();
        formData.append('draw', '1');
        formData.append('start', params?.page ? ((params.page - 1) * 10).toString() : '0');
        formData.append('length', '10');

        if (params) {
            if (params.structureIds?.length) {
                formData.append('StructureIds', params.structureIds.join(','));
            }
            if (params.userIds?.length) {
                formData.append('UserIds', params.userIds.join(','));
            }
            if (params.fromDate) {
                formData.append('FromDate', params.fromDate);
            }
            if (params.toDate) {
                formData.append('ToDate', params.toDate);
            }
            if (params.isOverdue !== undefined) {
                formData.append('Overdue', params.isOverdue.toString());
            }
            if (params.privacyId) {
                formData.append('PrivacyId', params.privacyId.toString());
            }
            if (params.priorityId) {
                formData.append('PriorityId', params.priorityId.toString());
            }
        }

        console.log('FormData entries:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        return this.http.post<ApiResponse<InprogressCorrespondence[]>>(
            `${this.baseUrl}/Report/ListCompletedCorrespondences`,
            formData
        );
    }
}
