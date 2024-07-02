import { Client } from "../../admin/models/client"

export interface ClientLogin {
  client_ID: string
  _id : string
  clientId : Client
  phoneNumber : string
  password: string
  image_url: string
  cloudinary_id: string
}
