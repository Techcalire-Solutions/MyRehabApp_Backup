import { User } from "./user";

export interface Celebrations {
  _id: string;
  userId: User;
  birthDate: Date;
  joiningDate: Date;
}
