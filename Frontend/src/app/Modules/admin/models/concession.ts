import { Client } from "./client";
import { User } from "./user";

export interface Concession{
  _id : String
  clientId : Client
  concessionAmount : Number
  referredBy : User
  date : Date
}
