import { Client } from "./client";
import { Slot } from "./slot";
import { User } from "./user";

export interface Session
{
  slotName:Slot,
  clientName:Client,
  therapistName:User,
  status: Boolean
  _id:String
  remarks : String,
  endDate : Date,
  fees : Number,
  discount : Number
  date: Date
  wl : Boolean
}
