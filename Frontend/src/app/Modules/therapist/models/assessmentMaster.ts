import { Assessment } from "../../admin/models/assessment";
import { CompensationSession } from "../../admin/models/compensation";
import { LeaveSession } from "../../admin/models/leaveSession";

export interface AssessmentMaster{
  _id:String,
  date:Date,
  assessment_id:Assessment,
  therapistName:String,
  assessmentFee:number,
  sessionStatus:String,
  feeStatus:Boolean,
  leave_session_id: LeaveSession,
  compensation_assessment_id: CompensationSession;
  category: string;
}
