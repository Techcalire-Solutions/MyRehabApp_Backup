import { Client } from "./client"
import { Slot } from "./slot"

export interface Leaves{
  _id: String,
  clientId : Client,
  fromDate : Date,
  toDate : Date,
  status : String
  slots : Slots[]
  reason : String
}

export interface Slots{
  slotId : Slot
  status : boolean
}
