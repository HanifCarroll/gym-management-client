export enum MemberStatus {
  Active = 'Active', Inactive = 'Inactive', Suspended = 'Suspended',
}

export interface MemberData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: MemberStatus;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
}
