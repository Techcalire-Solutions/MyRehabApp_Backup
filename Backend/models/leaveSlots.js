const mongoose = require('mongoose')


const leaveSlotsSchema = new mongoose.Schema({

    leaveDate: {type:Date},
    slots:[
        {   
            slot_id: {type:mongoose.Schema.Types.ObjectId, ref:'Slot'},
            status: {type:Boolean}
        }
     ]


})