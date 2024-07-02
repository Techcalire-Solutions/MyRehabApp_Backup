import { SessionMaster } from '../../therapist/models/sessionMaster';
import { Client } from './client';

export interface Wallet{
  _id : String
  clientId : Client
  cashIn : CashIn[],
  cashOut : CashOut[],
  balanceAmount : Number
}

export interface CashIn{
  _id: string
  date : Date,
  amount : Number
  paymentMode: string

}

export interface CashOut{
  date : Date,
  amount : Number
  sessionMasterId : SessionMaster
}
