export interface InprogressReport {
  id: number;
  categoryId: number;
  referenceNumber: string | null;
  fromStructureId: number;
  fromStructure: string;
  toStructureId: number;
  toStructure: string;
  fromUserId: number;
  fromUser: string;
  toUserId: number | null;
  toUser: string;
  subject: string;
  transferDate: string;
  isOverDue: boolean;
  searchOverDue: boolean;
}