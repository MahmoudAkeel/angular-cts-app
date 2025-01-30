export interface ActivityLogResponse {
  id: number;
  user: string;
  statusId: number;
  actionId: number;
  action: string;
  createdDate: string;
  time: string;
  note: string;
  originalValue: string;
  newOriginalValue: string;
  subject: string;
  referenceNumber: string;
}
