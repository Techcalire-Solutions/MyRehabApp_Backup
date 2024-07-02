import { User } from "../../auth/models/User"
import { AssessmentMaster } from "../../therapist/models/assessmentMaster"
import { GroupMaster } from "../../therapist/models/groupMaster"
import { Client } from "./client"

export interface GroupFeeMaster{
  sessionMasterId:GroupMaster
  clientId:Client,
  collectedAmount:number,
  dateAndTime:Date,
  recievedBy:User,
  paymentMode:String,
  remarks:String,
  amountToBeCollected : Number
}
