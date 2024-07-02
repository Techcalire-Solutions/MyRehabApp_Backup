import { Client } from "./client";
import { Slot } from "./slot";
import { User } from "./user";

export interface GroupSession
{
  slotName:Slot,
  clientName: client[],
  therapistName: therapist[],
  status: Boolean
  _id:String
  // remarks : String,
  // endDate : Date,
  // fees : Number,
  // discount : Number
}

interface client{
  clientId: Client
}

interface therapist{
  therapistId: User
}
