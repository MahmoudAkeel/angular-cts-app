export interface AttachmentsApiResponce {
  id: string;
  text: string;
  title: string | null;
  type: string;
  parentId: string | null;
  icon: string;
  state: any;
  isLocked: boolean | null;
  children: Children[] | null;
  data: any |null;
  count: number | null;
}

 interface Children {
  id: string;
  text: string;
  title: string | null;
  type: string;
  parentId: string | null;
  icon: string;
  state: any;
  isLocked: boolean | null;
  children: any[] | null;
  data: any | null;
  count: number;
}
