
import { Category } from "./category";
import { Company } from "./company";

export interface User{
  _id:string,
  name:string,
  email:string,
  password:string,
  date:string,
  role:string,
  therapyCategory:Category,
  md: boolean
  file_url: string
  sharePercentage: number
  qualifications: Qulaification[]
  experiences: Experience[]
  companyId: Company
}

export interface Qulaification{
  qualification : string
}

export interface Experience{
  experience : string
}
