import { dA } from '@fullcalendar/core/internal-common';
import { Subscription, combineLatest, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { User } from 'src/app/Modules/admin/models/user';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from 'src/app/Modules/admin/components/user/add-user/add-user.component';
import { DatePipe } from '@angular/common';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { AssessmentMaster } from 'src/app/Modules/therapist/models/assessmentMaster';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  ngOnDestroy(){
    if(this.expenseSub){
      this.expenseSub.unsubscribe();
    }
    if(this.aFeeSub){
      this.aFeeSub.unsubscribe();
    }
    if(this.sFeeSub){
      this.sFeeSub.unsubscribe();
    }
    if(this.gFeeSub){
      this.gFeeSub.unsubscribe();
    }
    if(this.tLeaveSub){
      this.tLeaveSub.unsubscribe();
    }
    if(this.sessionSub){
      this.sessionSub.unsubscribe();
    }
    if(this.assessmentSub){
      this.assessmentSub.unsubscribe();
    }
    if(this.groupSessionSub){
      this.groupSessionSub.unsubscribe();
    }
    if(this.leaveSessionSub){
      this.leaveSessionSub.unsubscribe();
    }
    if(this.sessionMasterSub){
      this.sessionMasterSub.unsubscribe();
    }
    if(this.assessmentMasterSub){
      this.assessmentMasterSub.unsubscribe();
    }
    if(this.groupMasterSub){
      this.groupMasterSub.unsubscribe();
    }
    if(this.lmcFeeSub){
      this.lmcFeeSub.unsubscribe();
    }
    this.pendGroupSub?.unsubscribe();
    this.pAssesFeeSub?.unsubscribe();
    this.pFeeSub?.unsubscribe();
    this.pLmcSub?.unsubscribe();
  }

  currentUser : any
  currentUserString : any
  currentMonth : any;
  date: any;
  weekDay: string;
  constructor(private adminService: AdminService, private dialog: MatDialog, private datePipe: DatePipe,
    private therapistService: TherapistService, private router: Router, private fb: FormBuilder) {
    this.currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(this.currentUserString).id

    this.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy')

    const currentDate = new Date();
    this.currentMonth  = currentDate.toISOString().slice(0, 7);

    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
  }

  userForm = this.fb.group({
    cloudinary_id : [''],
    file_url : ['']
  });


  ngOnInit(): void {
    this.getUser()
  }

  file!: any;
  url!: any;
  uploadStatus = false
  imageUrl!: string;
  onFileSelected(event: any){
    if(event.target.files.length > 0){
      this.uploadStatus= true
      this.file = event.target.files[0]
      let fileType = this.file? this.file.type : '';

      if (this.file) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }

      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }
      // }
      // else {
      //   window.alert('Please select correct image format');
      // }
    }
  }

  onUpload(){
    this.uploadStatus = false
    this.adminService.uploadUserImage(this.file).subscribe(res=>{
      this.userForm.patchValue({
        cloudinary_id : res.public_id,
        file_url: res.url
      })
      this.adminService.editUserUploadImage(this.userForm.getRawValue(), this.currentUser).subscribe(res=>{
        this.getUser()
      })
    })
  }

  userSub: Subscription;
  users: User;
  getUser(){
    this.adminService.getTherapistById(this.currentUser).subscribe(res =>{
      this.users = res;
      if(this.users.role == 'admin'){
        this.getExpense()
        this.getFees()
        this.getPendingFees()
      }else if(this.users.role.toLowerCase() == 'therapist'){
        this.getTherapistLeaves()
        this.getSessions()
        this.getAssessment()
        this.getGroupSession()
        this.getLeaveSession()
      }
    })
  }

  //ADMIN REPORTS
  expenseSub: Subscription;
  expense: number = 0;
  expenseMonth: number = 0;
  getExpense(){
    this.expenseSub = this.adminService.getDailyExpense().subscribe(expense => {
      let exp = expense.filter(x=> x.collectedFrom._id === this.users._id && this.datePipe.transform(x.date, 'dd/MM/yyyy') === this.date);
      for (let i = 0; i < exp.length; i++) {
        let amount = exp[i].expense
        this.expense = this.expense + amount;
      }

      let expM = expense.filter(x=> x.collectedFrom._id === this.users._id && this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth);
      for (let i = 0; i < expM.length; i++) {
        let amount = expM[i].expense
        this.expenseMonth = this.expenseMonth + amount;
      }
    })
  }

  aFeeSub: Subscription;
  sFeeSub: Subscription;
  gFeeSub: Subscription;
  lmcFeeSub: Subscription;
  assessmentFee: number = 0;
  sessionFee: number = 0;
  groupFee: number = 0;
  assessmentFeeMonth: number = 0;
  sessionFeeMonth: number = 0;
  groupFeeMonth: number = 0;
  lmcFeeTher: number = 0;
  lmcFeeClinic: number = 0;
  lmcFeeTherMonth: number = 0;
  lmcFeeClinicMonth: number = 0;
  getFees(){
    this.aFeeSub = this.adminService.getPayedAssessmentFees().subscribe(fees =>{
      let x = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'dd/MM/yyyy') === this.date);
      for (let i = 0; i < x.length; i++) {
        let amount = x[i].collectedAmount
        this.assessmentFee = this.assessmentFee + amount;
      }

      let xM = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'yyyy-MM') === this.currentMonth);
      for (let i = 0; i < xM.length; i++) {
        let amount = xM[i].collectedAmount
        this.assessmentFeeMonth = this.assessmentFeeMonth + amount;
      }
    })

    this.sFeeSub = this.adminService.getPayedFees().subscribe(fees =>{
      let x = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'dd/MM/yyyy') === this.date
        && x.sessionType.toLowerCase() != 'lmc');
      for (let i = 0; i < x.length; i++) {
        let amount = x[i].collectedAmount
        this.sessionFee = this.sessionFee + amount;
      }

      let xM = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'yyyy-MM') === this.currentMonth
        && x.sessionType.toLowerCase() != 'lmc');
      for (let i = 0; i < xM.length; i++) {
        let amount = xM[i].collectedAmount
        this.sessionFeeMonth = this.sessionFeeMonth + amount;
      }
    })

    this.lmcFeeSub = this.adminService.getPayedFees().subscribe(fees =>{
      let x = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'dd/MM/yyyy') === this.date
        && x.sessionType.toLowerCase() === 'lmc');
      for (let i = 0; i < x.length; i++) {
        if(x[i].collectedTo.toLowerCase()=== 'clinic'){
          let amount = x[i].collectedAmount
          this.lmcFeeClinic = this.lmcFeeClinic + amount;
        }else if(x[i].collectedTo.toLowerCase()=== 'therapist'){
          let amount = x[i].collectedAmount
          this.lmcFeeTher = this.lmcFeeTher + amount;
        }

      }

      let xM = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'yyyy-MM') === this.currentMonth
        && x.sessionType.toLowerCase() === 'lmc');
      for (let i = 0; i < xM.length; i++) {
        if(x[i].collectedTo.toLowerCase()=== 'clinic'){
          let amount = x[i].collectedAmount
          this.lmcFeeClinicMonth = this.lmcFeeClinicMonth + amount;
        }else if(x[i].collectedTo.toLowerCase()=== 'therapist'){
          let amount = x[i].collectedAmount
          this.lmcFeeTherMonth = this.lmcFeeTherMonth + amount;
        }
      }
    })


    this.gFeeSub = this.adminService.getPayedGroupFees().subscribe(fees =>{
      let x = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'dd/MM/yyyy') === this.date);
      for (let i = 0; i < x.length; i++) {
        let amount = x[i].collectedAmount
        this.groupFee = this.groupFee + amount;
      }

      let xM = fees.filter(x=>
        x.recievedBy._id === this.users._id
        && this.datePipe.transform(x.dateAndTime, 'yyyy-MM') === this.currentMonth);
      for (let i = 0; i < xM.length; i++) {
        let amount = xM[i].collectedAmount
        this.groupFeeMonth = this.groupFeeMonth + amount;
      }
    })
  }

  pFeeSub: Subscription;
  pendSessionFee: number = 0;
  pendSessionFeeMonth: number = 0;
  pAssesFeeSub: Subscription;
  pendAssessFee: number = 0;
  pendAssessFeeMonth: number = 0;
  clientFees: any[];
  pendGroupSub:Subscription;
  pendGroupFee: number = 0;
  pendGroupFeeMonth: number = 0;
  pLmcSub: Subscription;
  pendLmcFee: number = 0;
  pendLmcFeeMonth: number = 0;
  getPendingFees(){
    this.pFeeSub = this.therapistService.getSessionMaster().subscribe(fees =>{
      let x = fees.filter(x=>
        this.datePipe.transform(x.date, 'dd/MM/yyyy') === this.date
        && x.feeStatus === false
        );
      for (let i = 0; i < x.length; i++) {
        let fee: any = x[i].sessionFee;
        let conce: any = x[i].concession;
        let amount = fee-conce
        this.pendSessionFee = this.pendSessionFee + amount;
      }

      let xM = fees.filter(x=> this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth);
      for (let i = 0; i < xM.length; i++) {
        let fee: any = xM[i]?.sessionFee;
        let conce: any = xM[i].concession;
        let amount = fee-conce
        this.pendSessionFeeMonth = this.pendSessionFeeMonth + amount;
      }
    })

    this.pAssesFeeSub = this.therapistService.getAssessmentMaster().subscribe(fees =>{
      let x = fees.filter(x=>
        this.datePipe.transform(x.date, 'dd/MM/yyyy') === this.date
        && x.feeStatus === false
        );
      for (let i = 0; i < x.length; i++) {
        let amount: any = x[i].assessmentFee;
        this.pendAssessFee = this.pendAssessFee + amount;
      }

      let xM = fees.filter(x=> this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth);
      for (let i = 0; i < xM.length; i++) {
        let amount: any = x[i].assessmentFee;
        this.pendAssessFeeMonth = this.pendAssessFeeMonth + amount;
      }
    })

    this.pendGroupSub = this.adminService.getGroupMaster().subscribe((res)=>{
 
      if(res.length > 0){
        let gm = res?.filter(x => this.datePipe.transform(x.date, 'dd/MM/yyyy') === this.date)
        for (const obj of gm) {
          this.clientFees = obj.clientName;
        }

        let pending = this.clientFees.filter((x) => x.feeStatus == false)
        for (let i = 0; i < pending.length; i++) {
          let amount: any = pending[i].sessionFee;
          this.pendGroupFee = this.pendGroupFee + amount;
        }

        let xM = res.filter(x=> this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth);
        for (const obj of xM) {
          this.clientFees = obj.clientName;
        }

        let pendingSessions = this.clientFees.filter((x) => x.feeStatus == false)
        for (let i = 0; i < pendingSessions.length; i++) {
          let amount: any = pendingSessions[i].sessionFee;
          this.pendGroupFeeMonth = this.pendGroupFeeMonth + amount;
        }
      }
    })

    this.pLmcSub = this.adminService.getLmc().subscribe(fees =>{
      let x = fees.filter(x=>
        this.datePipe.transform(x.date, 'dd/MM/yyyy') === this.date
        && x.feeStatus === false
        );
      for (let i = 0; i < x.length; i++) {
        let amount: any = x[i].sessionFee;
        this.pendLmcFee = this.pendLmcFee + amount;
      }

      let xM = fees.filter(x=> this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth);
      for (let i = 0; i < xM.length; i++) {
        let amount: any = x[i].sessionFee;
        this.pendLmcFeeMonth = this.pendLmcFeeMonth + amount;
      }
    })
  }


  //ADMIN REPORTS END

  //THERAPIST REPORTS
  tLeaveSub: Subscription;
  tLeave: number = 0;
  leaveCountForCurrentMonth: number;
  getTherapistLeaves(){
    this.tLeaveSub = this.adminService.getTherapistLeave().subscribe((leave) =>{
      let tLeave = leave.filter((x) => x.status.toLowerCase() === 'approved' && x.therapistId._id === this.currentUser)

      // Initialize an object to store leave counts for each month
      const leaveCountsByMonth = {};

      // Loop through the leave records
      tLeave.forEach((leaveRecord) => {
        const fromDate = new Date(leaveRecord.fromDate);
        const toDate = new Date(leaveRecord.toDate);

        // Calculate the year and month for the leave
        const year = fromDate.getFullYear();
        const month = fromDate.getMonth() + 1; // Months are zero-indexed, so add 1

        // Create a unique key for the year and month
        const monthKey = `${year}-${month}`;

        // Increment the leave count for that month
        if (leaveCountsByMonth[monthKey]) {
          leaveCountsByMonth[monthKey] += 1;
        } else {
          leaveCountsByMonth[monthKey] = 1;
        }
      });

      // Get the current date
      const currentDate = new Date();

      // Get the current year and month
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1

      // Create a key for the current month
      const currentMonthKey = `${currentYear}-${currentMonth}`;

      // Get the leave count for the current month
      this.leaveCountForCurrentMonth = leaveCountsByMonth[currentMonthKey] || 0;

    })
  }

  getCurrentMonthKey() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
    return `${currentYear}-${currentMonth}`;
  }

  sessionSub: Subscription;
  sessionCountDay: number = 0;
  sessionMasterSub: Subscription;
  sessionMasterDay: number = 0;
  sessionCountMonth: number = 0;
  getSessions() {
    const currentMonth = new Date().getMonth() + 1;

    this.sessionSub = this.adminService.getSession().subscribe(res=>{
      this.sessionCountDay = res.filter(session=>
        session.slotName.weekDay === this.weekDay &&
        session.therapistName._id === this.currentUser
      ).length;
    })

    this.sessionMasterSub = combineLatest(
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>
          y.sessionStatus == "Session" &&
          y.session_id.therapistName._id === this.currentUser
          )
        )
      ),
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>
          y.sessionStatus == "LeaveSession" &&
          y.leave_session_id.therapistName._id === this.currentUser)
        )
      ),
      this.therapistService.getSessionMaster().pipe(
        map((x : SessionMaster[]) => x.filter((y) =>
          y.sessionStatus == "CompensationSession" &&
          y.compensation_session_id.therapistName._id === this.currentUser)
        )
      ),
    ).subscribe(([s, z, x]) => {
      const aMaster = [...s, ...z, ...x];
      this.sessionMasterDay = aMaster.filter(a =>
        this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date
      ).length


      this.sessionCountMonth = aMaster.filter(x =>
        this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth
      ).length
    })

  }

  assessmentSub: Subscription;
  assessmentCountDay: number = 0;
  assessmentMasterSub: Subscription;
  assessmentMasterDay: number;
  assessmentCountMonth: number;
  getAssessment() {
    this.assessmentSub = this.adminService.getAssessmentSession().subscribe(res=>{
      this.assessmentCountDay = res.filter(session=>
        this.datePipe.transform(session.assessmentDate, 'dd/MM/yyyy') === this.date &&
        session.therapistName._id === this.currentUser
      ).length;
    })

    this.assessmentMasterSub = combineLatest(
      this.therapistService.getAssessmentMaster().pipe(
        map((x : AssessmentMaster[]) => x.filter((y) =>
          y.sessionStatus == "Assessment" &&
          y.assessment_id.therapistName._id === this.currentUser
          )
        )
      ),
      this.therapistService.getAssessmentMaster().pipe(
        map((x : AssessmentMaster[]) => x.filter((y) =>
          y.sessionStatus == "LeaveAssessment" &&
          y.leave_session_id.therapistName._id === this.currentUser)
        )
      ),
      this.therapistService.getAssessmentMaster().pipe(
        map((x : AssessmentMaster[]) => x.filter((y) =>
          y.sessionStatus == "CompensationAssessment" &&
          y.compensation_assessment_id.therapistName._id === this.currentUser)
        )
      ),
    ).subscribe(([s, z, x]) => {
      const aMaster = [...s, ...z, ...x];
      this.assessmentCountDay = aMaster.filter(a =>
        this.datePipe.transform(a.date, 'dd/MM/yyyy') === this.date
      ).length

      this.assessmentCountMonth = aMaster.filter(x =>
        this.datePipe.transform(x.date, 'yyyy-MM') === this.currentMonth
      ).length
    })
  }

  groupSessionSub: Subscription;
  groupSessionCountDay: number = 0;
  groupMasterSub: Subscription;
  groupMasterCountDay: number = 0;
  groupMasterCountMonth: number = 0;
  getGroupSession() {
    this.groupSessionSub = this.adminService.getGroupSession().subscribe(res=>{
      this.groupSessionCountDay = res.filter(session=> session.slotName.weekDay === this.weekDay&&
        session.therapistName.some(therapist => therapist.therapistId.name === this.currentUser)).length;
    })

    this.groupMasterSub = this.adminService.getGroupMaster().subscribe(res=>{
      this.groupMasterCountDay = res.filter(session=>
        this.datePipe.transform(session.date, 'dd/MM/yyyy') === this.date &&
        session.session_id.therapistName.some(therapist => therapist.therapistId.name === this.currentUser)
      ).length;

      this.groupMasterCountMonth = res.filter(session=>
        this.datePipe.transform(session.date, 'yyyy-MM') === this.currentMonth &&
        session.session_id.therapistName.some(therapist => therapist.therapistId.name === this.currentUser)
      ).length;
    })
  }

  leaveSessionSub: Subscription;
  leaveSessionCountDay: number = 0;
  leaveAssessmentCountDay: number = 0;
  getLeaveSession() {
    this.leaveSessionSub = this.adminService.getLeaveSession().subscribe(res=>{
      this.leaveSessionCountDay = res.filter(session=>
        session.assessmentDate === this.date &&
        session.therapistName._id === this.currentUser &&
        session.sessionType.toLowerCase() === 'session'
      ).length;

      this.leaveAssessmentCountDay = res.filter(session=>
        session.assessmentDate === this.date &&
        session.therapistName._id === this.currentUser &&
        session.sessionType.toLowerCase() === 'assessment'
      ).length;
    })
  }

  compSessionSub: Subscription;
  compSessionCountDay: number = 0;
  compAssessmentCountDay: number = 0;
  getCompSession() {
    this.compSessionSub = this.therapistService.getCompensation().subscribe(res=>{
      this.compSessionCountDay = res.filter(session=>
        session.date === this.date &&
        session.therapistName._id === this.currentUser &&
        session.sessionType.toLowerCase() === 'session'
      ).length;

      this.compAssessmentCountDay = res.filter(session=>
        session.date === this.date &&
        session.therapistName._id === this.currentUser &&
        session.sessionType.toLowerCase() === 'assessment'
      ).length;
    })
  }

  //THERAPIST REPORTS END

  editProfile(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {status : 'true', id : this.currentUser, role : this.users.role}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUser()
    })
  }

  reqLeave(){
    this.router.navigate(['/therapist/addleave'])
  }

  uploadDocuments(){
    const dialogRef = this.dialog.open(AddUserComponent, {
      data: {status : 'documents', id : this.currentUser, role : this.users.role}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUser()
    })
  }
}
