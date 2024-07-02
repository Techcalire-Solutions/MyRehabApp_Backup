import { User } from "../../admin/models/user";

export interface AdminLeave {
  _id: string;
  leaveType: string;
  reason: string;
  fromDate: Date;
  toDate: Date;
  adminId: User;
  status: string;
}
