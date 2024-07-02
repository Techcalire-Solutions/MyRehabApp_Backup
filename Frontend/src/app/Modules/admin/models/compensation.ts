import { TherapistLeave } from "../../therapist/models/therapistLeave";
import { Client } from "./client";
import { Slot } from "./slot";
import { User } from "./user";

export interface CompensationSession{
  _id: string;
  therapistLeaveId: TherapistLeave,
  slotName:Slot,
  clientName:Client,
  date: Date,
  therapistName:User,
  sessionType : string,
  status : boolean,
  startTime : string,
  endTime : string
}
