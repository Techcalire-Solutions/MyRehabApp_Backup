import { Session } from "../../admin/models/session"
import { SeSessionData } from "./seSessionData"

export interface StSkill
{
  _id:String,
  skill: String,
  // expectPeriod: String
  status: Boolean,
  sessionId: Session
}
