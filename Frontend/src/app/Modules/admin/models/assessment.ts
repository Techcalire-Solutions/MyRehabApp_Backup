import { Client } from "./client";
import { Slot } from "./slot";
import { User } from "./user";

export interface Assessment
{
  slotName:Slot,
  clientName:Client,
  therapistName:User,
  status: Boolean
  assessmentDate: Date
  _id:String
  remarks : String
  endDate : Date
  items : any[]
  wl : boolean
}
