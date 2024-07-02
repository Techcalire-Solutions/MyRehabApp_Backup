import { Medical } from "./medical";
import { Routine } from "./routine";
import { School } from "./school";

export interface Client{
  _id:string,
  client_ID : string,
  password:string,
  firstName : string,
  emergencyNumber: string,
  email : string,
  dateOfBirth : string,
  gender: string,
  nationality : string,
  homeLanguage : string,
  familyType : string,
  familyMembers: string[],
  referrerDetails : string,
  reason : string,
  fatherName :string,
  fatherMobile :string,
  fatherOccupation :string,
  motherName : string,
  motherMobile : string,
  motherOccupation : string,
  annualIncome : string,
  siblingsDetails : string,
  address1 : string,
  address2 : string,
  pincode : string,
  status : string,
  preferredTiming : string,
  loginStatus : boolean,
  medical:Medical,
  school:School,
  routine:Routine
}
