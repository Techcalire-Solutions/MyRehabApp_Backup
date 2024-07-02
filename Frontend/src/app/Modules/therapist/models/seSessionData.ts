import { SeGoal } from "./seGoal"
import { SessionMaster } from "./sessionMaster"

export  interface SeSessionData{
  _id: String
  date: Date
  updatedDate: Date,
  session_master_id: SessionMaster,
  seDatas: SeDatas[]
}

export interface SeDatas{
  goal : SeGoal
  activities : String
  response : String
  notes : String
  status : Boolean
  _id: String

}
