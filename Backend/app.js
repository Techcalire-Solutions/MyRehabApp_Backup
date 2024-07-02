const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const clientRouter = require('./routers/clientRouter')
const clientLoginRouter = require('./routers/clientLoginRouter')
const authRoute =require('./routers/auth')
const postRoute = require('./routers/verifyToken')
const slotRoute = require('./routers/slotRouter')
const roomRoute = require('./routers/roomRouter')
const sessionRoute = require('./routers/sessionRouter')
const categoryRoute = require('./routers/categoryRouter')
const userRoute = require('./routers/userRouter')
const asssessmentRoute = require('./routers/assessmentRouter')
const therapistLeaveRoute = require('./routers/therapistLeaveRouter')
const sessionMasterRoute = require('./routers/session_masterRouter')
const feeMasterRoute = require('./routers/fee_masterRouter')
const assessmentFeeMaster = require('./routers/assessmentFeeMaster')
const otSessionDataRoute = require('./routers/otSessionDataRouter')
const stSessionDataRoute = require('./routers/stSessionDataRouter')
const stSkillRoute = require('./routers/stSkillRouter')
const seSessionDataRoute = require('./routers/seSessionDataRouter')
const seGoalRoute = require('./routers/seGoalRouter')
const btSessionDataRoute = require('./routers/btSessionDataRouter')
const assessmentMasterRoute = require('./routers/assessmentMaster')
const stAssessmentFormRoute = require('./routers/stAssessmentFormRouter')
const otAssessmentFormRoute = require('./routers/otAssessmentFormRouter')
const seAssementFormRoute = require('./routers/seAssementFormRouter')
const btAssessmentFormRoute = require('./routers/btAssessmentFormRouter')
const feesRoute = require('./routers/feesRouter')
const concessionRoute = require('./routers/concessionRouter')
const walletRoute = require('./routers/walletRouter')
const leaveRoute = require('./routers/leaveRouter')
const pendingFees = require('./routers/pendingFeesRouter')
const leaveSession = require('./routers/leaveSessionRouter')
const lmc = require('./routers/lmcRouter')
const salary = require('./routers/salaryRouter')
const groupsession = require('./routers/groupSessionRouter')
const groupMaster = require('./routers/groupMasterRouter')
const groupFeeMaster = require('./routers/groupFeeMaster')
const therapistLeave = require('./routers/therapistLeaveRouter')
const compensationSession = require('./routers/compensationRouter');
const dailyExpense = require('./routers/dailyExpense');
const task =  require('./routers/taskRouter');
const goal =  require('./routers/goalRouter');
const celebration = require('./routers/celebration');
const adminLeave = require('./routers/adminLeave');
const company = require('./routers/company');
const wl = require('./routers/waitingList');
const activity = require('./routers/activityRouter');

const initialization = require('./utlis/multiCreation')

require('dotenv/config')

//middleware
const app = express();

app.use(express.json());

app.use(cors({orgin:'*'}))

//router middleware
app.use('/client',clientRouter);
app.use('/clientlogin',clientLoginRouter);
app.use('/user',authRoute)
app.use('/verifyToken',postRoute)
app.use('/admin',userRoute)
app.use('/admin',slotRoute)
app.use('/admin',sessionRoute)
app.use('/admin',roomRoute)
app.use('/admin',categoryRoute)
app.use('/admin',asssessmentRoute)
app.use('/admin',therapistLeaveRoute)
app.use('/therapist',sessionMasterRoute)
app.use('/admin',feeMasterRoute)
app.use('/admin',assessmentFeeMaster)
app.use('/therapist',otSessionDataRoute)
app.use('/therapist',stSessionDataRoute)
app.use('/therapist',stSkillRoute)
app.use('/therapist',seSessionDataRoute)
app.use('/therapist',seGoalRoute)
app.use('/therapist',btSessionDataRoute)
app.use('/therapist',assessmentMasterRoute)
app.use('/therapist',stAssessmentFormRoute)
app.use('/therapist',otAssessmentFormRoute)
app.use('/therapist',seAssementFormRoute)
app.use('/therapist',btAssessmentFormRoute)
app.use('/therapist',therapistLeave)
app.use('/admin',feesRoute)
app.use('/admin', concessionRoute)
app.use('/admin', walletRoute)
app.use('/admin', leaveRoute)
app.use('/admin', pendingFees)
app.use('/admin', leaveSession)
app.use('/admin', lmc)
app.use('/admin', groupsession)
app.use('/admin', groupMaster)
app.use('/admin', groupFeeMaster)
app.use('/therapist', compensationSession)
app.use('/admin', dailyExpense)
app.use('/therapist',task)
app.use('/goal',goal)
app.use('/celebration',celebration)
app.use('/admin',salary)
app.use('/admin',adminLeave)
app.use('/company',company)
app.use('/waitinglist', wl)
app.use('/therapist', activity)


initialization()


//Database connection
mongoose.connect(process.env.DB_HOST, (err)=>{
    if(err) console.log(err)
    else console.log("DB connected successfully")    
});



app.listen(9000, (err)=>{
    if(err) console.log(err)
    else console.log("Server is running on 9000")
})
