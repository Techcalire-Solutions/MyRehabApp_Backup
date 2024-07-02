import { Client } from "./client";
import { Session } from "./session";
import { Slot } from "./slot";
import { User } from "./user";

export interface Lmc{
  _id: String
  clientId : Client,
  date : Date,
  slots : Slots[],
  sessionStatus : String,
  sessionFee: Number,
  session_id: Session,
  concession: Number,
  feeStatus: Boolean,
}

interface Slots{
  _id: string
  slotId : Slot
  therapistId : User
  status : boolean
  feeStatus: Boolean,
  amountToInara: Number,
  amountToTherapist: Number
}
