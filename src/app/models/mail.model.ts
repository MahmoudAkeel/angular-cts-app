export interface ToUserValueText {
    id: number;
    text: string;
    parentName: string | null;
    parentNodeId: number | null;
}

export interface Mail {
    id: number;
    toUser: string;
    fromDate: string;
    toDate: string;
    createdDate: string;
    modifiedDate: string | null;
    categoryIds: number[];
    toUserValueText: ToUserValueText;
    privacyId: number;
    privacyName: string;
    allowSign: boolean;
    draftInbox: boolean;
    showOldCorrespondecne: boolean;
    startDate: string | null;
    note: string | null;
}