
interface Receiver {
  id: number;
  text: null;
  isEntityGroup: boolean;
}

interface SendingEntity {
  id: number;
  text: string;
  parentName: null;
  parentNodeId: null;
}

interface Classification {
  id: number;
  text: null;
  parentName: null;
  parentNodeId: null;
}

interface DocumentType {
  id: number;
  text: null;
  parentName: null;
  parentNodeId: null;
}

export interface DocAttributesApiResponse {
  referenceNumber: string;
  senderPerson: number;
  isExternalSender: boolean;
  receiverPerson: string;
  isExternalReceiver: boolean;
  status: number;
  createdByUser: string;
  createdByUserId: number;
  attachmentId: null;
  attachmentCount: number;
  notesCount: number;
  linkedCorrespondanceCount: number;
  id: number;
  transferId: null;
  subject: string;
  categoryName: string;
  basicAttributes: any[];
  customAttributes: any;
  customAttributesTranslation: any[];
  formData: {
    tags: string;
  };
  receivers: Receiver[];
  sendingEntityId: number;
  sender: null;
  receiver: null;
  dueDate: string;
  createdDate: null;
  priorityId: number;
  privacyId: number;
  carbonCopy: any[];
  importanceId: null;
  classificationId: null;
  documentTypeId: null;
  templateId: null;
  fromStructureId: number;
  scannedFile: null;
  sendingEntity: SendingEntity;
  receivingEntities: Receiver[];
  carbonCopies: any[];
  classification: Classification;
  documentType: DocumentType;
  register: boolean;
  body: string;
  externalReferenceNumber: string;
  keyword: string;
  categoryId: number;
  createdByStructureId: number;
  isLocked: null;
  enableEdit: boolean;
  fullControl: null;
  assigneeOperationPermission: null;
  documentDate: null;
  statusId: null;
  isTaskCreator: null;
  enableAttributeEditSign: boolean;
  instruction: null;
  delegationId: null;
}
