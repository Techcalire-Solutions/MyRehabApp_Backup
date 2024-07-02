import { Category } from "./category";
import { Room } from "./room";
import { User } from "./user";


export interface Slot{
  _id:String,
  roomName :User,
  slotName:String,
  startTime :string,
  endTime :String,
  weekDay:string,
  therapyCategory:Category,
  slotStatus:Boolean,
  onCall: boolean,
  items: any[];
}
