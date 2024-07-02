import { Client } from "../../admin/models/client"
import { GroupSession } from "../../admin/models/groupSession"
import { User } from "../../admin/models/user"

export interface GroupMaster{
  _id: string,
  date: Date,
  session_id: GroupSession,
  clientName: Clie[],
  therapistName:Therapi[]
}

interface Clie {
    clientId: Client,
    concession: number,
    sessionFee: number,
    feeStatus: boolean
    _id: string
}

interface Therapi {
  therapistId: User
}
