export interface Transfer {
    id: number;
    fromStructure: string;
    toStructure: string;
    fromUser: string;
    toUser: string;
    transferDate: string;
    isOverDue: boolean;
}

export interface InprogressCorrespondence {
    id: number;
    categoryId: number;
    categoryName: string;
    referenceNumber: string | null;
    subject: string;
    isOverDue: boolean;
    sendingEntity: string;
    receivingEntity: string;
    importanceId: number | null;
    status: number;
    priorityId: number;
    dueDate: string;
    createdDate: string;
    modifiedDate: string;
    transfers: Transfer[];
}

export interface InprogressCorrespondenceResponse {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: InprogressCorrespondence[];
} 