import { Session } from "../../admin/models/session"
import { SeSessionData } from "./seSessionData"

export interface SeGoal
{
  _id:String,
  goal: String,
  expectPeriod: String,
  status: Boolean,
  sessionId: Session
}
