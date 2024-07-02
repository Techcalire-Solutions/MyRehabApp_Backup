import { Assessment } from "../../admin/models/assessment";
import { CompensationSession } from "../../admin/models/compensation";
import { LeaveSession } from "../../admin/models/leaveSession";
import { Session } from "../../admin/models/session";

export interface SessionMaster{
  _id:String,
  date:Date,
  session_id:Session,
  therapistName:String,
  sessionFee:number,
  feeStatus:Boolean,
  concession: Number,
  sessionStatus: String
  leave_session_id: LeaveSession
  compensation_session_id: CompensationSession
  category: string
}
