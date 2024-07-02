import { User } from "../../auth/models/User"
import { AssessmentMaster } from "../../therapist/models/assessmentMaster"

export interface AssessmentFeeMaster{
  sessionMasterId:AssessmentMaster
  // sessionType:String,
  collectedAmount:number,
  dateAndTime:Date,
  recievedBy:User,
  paymentMode:String,
  remarks:String,
  amountToBeCollected : Number
  paymentDate: Date
}
