import { Client } from "../../admin/models/client";
import { Slot } from "../../admin/models/slot";
import { User } from "../../admin/models/user";

export interface TherapistLeave {
  _id: string;
  leaveType: string;
  reason: string;
  fromDate: Date;
  toDate: Date;
  therapistId: User;
  status: string;
  compensation: Compensation[];
}

interface Compensation {
  clientId: Client;
  slotId: Slot;
  date: Date;
}
