import { SessionMaster } from "../../therapist/models/sessionMaster"

export interface Task {
  _id: string
  sessionMasterId : SessionMaster
  tasks : Tasks[]
  assignedDate :Date
  taskStatus : string
}

export interface Tasks {
  _id: string
  date : Date
  completedDate : Date
  task : string
  point : number
  status : string
  response:  string
  cloudinary_id : string
  file_url : string
  task_cloudinary_id:string
  task_file_url:string
  remarks : string
}
