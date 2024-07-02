import { SessionMaster } from "../../therapist/models/sessionMaster"

export interface Activity {
  _id: string
  sessionMasterId : SessionMaster
  activityDetails : Activities[]
  assignedDate :Date
  activityStatus : boolean
}

export interface Activities {
  _id: string

  activity : string
  response:  string
  status : boolean


}
