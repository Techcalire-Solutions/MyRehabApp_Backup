import { SessionMaster } from "../../therapist/models/sessionMaster"
import { Lmc } from "./lmc"
import { User } from "./user"

export interface FeeMaster {
  _id: string
  sessionMasterId:SessionMaster
  sessionType:String,
  collectedAmount:number,
  dateAndTime:Date,
  recievedBy:User,
  paymentMode:String,
  remarks:String,
  amountToBeCollected : Number,
  paymentDate:Date,
  collectedTo: string,
  lmcId: Lmc
  arrayId : string
}
