import { GroupMaster } from "../../therapist/models/groupMaster";
import { SessionMaster } from "../../therapist/models/sessionMaster";
import { Client } from "./client";
import { Lmc } from "./lmc";

export interface PendingFees{
  _id : string;
  sessionMasterId : SessionMaster
  pendingAmount : number
  type : string
  lmcId : Lmc
  groupMasterId : GroupMaster
  clientId: Client
}
