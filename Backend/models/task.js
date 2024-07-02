const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        sessionMasterId :{type: mongoose.Schema.Types.ObjectId, ref:'SessionMaster'},
        tasks : [{
            date : {type: Date},
            task : {type: String, default: 'abcd'},
            completedDate : {type: Date},
            point : {type: Number},
            status : {type: String, default: 'Pending'},
            response:  {type: String},
            cloudinary_id : {type:String},
            file_url : {type:String},
            task_cloudinary_id:{type :String},
            task_file_url : {type:String}
        }],
        assignedDate :{type: Date, default: Date.now()},
        taskStatus : {type: String, default: 'Assigned'}
    }
)



const taskModel = mongoose.model('Task',taskSchema)

module.exports = taskModel