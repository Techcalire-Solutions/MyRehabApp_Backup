import { Client } from "../../admin/models/client"

export interface Goal {
  _id : string
  clientId : Client
  date : Date
  goals : Goals[]
}

interface Goals{
  _id: string
  goal : string
  term : string
  progressNote : string
  startDate : Date
  endDate : Date
  goalStatus :boolean
  goalRemarks : string
}
