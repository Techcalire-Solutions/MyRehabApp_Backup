import { Client } from "./client";
import { Slot } from "./slot";
import { User } from "./user";

export interface LeaveSession
{
  slotName:Slot,
  clientName:Client,
  therapistName:User,
  assessmentDate: Date
  sessionType: String
  _id:String
  status : Boolean,
  remarks : String,
  endDate : Date,
  fees : Number,
  discount : Number
}
