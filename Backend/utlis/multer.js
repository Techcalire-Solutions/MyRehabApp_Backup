const multer = require('multer');
const path = require('path');
  


module.exports = multer({

    storage:multer.diskStorage({}),

    // fileName:(req, res, cb)=>{
    //     cb(null, new Date().toISOString()+ '_'+ file.originalname)
    // },
    
    fileFilter:(req,file,cb)=>{
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !==".jpeg" && ext !==".png" && ext !== ".pdf"){
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    }   
})