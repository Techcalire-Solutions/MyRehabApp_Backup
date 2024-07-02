import { User } from "./user";

export interface DailyExpense
{
  _id:String,
  date: Date,
  expense: number;
  type: string;
  collectedFrom: User;
  otherExpense: string;
}
