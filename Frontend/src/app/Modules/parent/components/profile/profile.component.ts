import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { ParentService } from '../../parent.service';
import { Client } from 'src/app/Modules/admin/models/client';
import { ClientLogin } from '../../models/client-login';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditLoginComponent } from '../edit-login/edit-login.component';
import { DatePipe } from '@angular/common';
import { TherapistService } from 'src/app/Modules/therapist/therapist.service';
import { SessionMaster } from 'src/app/Modules/therapist/models/sessionMaster';
import { AssessmentMaster } from 'src/app/Modules/therapist/models/assessmentMaster';
import { GroupMaster } from 'src/app/Modules/therapist/models/groupMaster';
import { Subscription, combineLatest, map } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  ngOnDestroy(){
    if(this.clientSub){
      this.clientSub.unsubscribe();
    }

    if(this.sFeeSub){
      this.sFeeSub.unsubscribe();
    }

    if(this.aFeeSub){
      this.aFeeSub.unsubscribe();
    }

    if(this.gFeeSub){
      this.gFeeSub.unsubscribe();
    }

    if(this.lmcSub){
      this.lmcSub.unsubscribe();
    }

    if(this.leaveSub){
      this.leaveSub.unsubscribe();
    }
  }


  date: string;
  currentMonth: string;
  constructor(private adminService: AdminService, private parentService: ParentService, private router: Router,
    private dialog: MatDialog, private datePipe: DatePipe, private therapistService: TherapistService,
    private fb: FormBuilder) {
      this.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy')

      const currentDate = new Date();
      this.currentMonth  = currentDate.toISOString().slice(0, 7);
    }

  currentUser: any;
  ngOnInit(): void {
    let currentUserString = localStorage.getItem('token')
    this.currentUser = JSON.parse(currentUserString)
    if(this.currentUser){  this.getClient() }
  }

  clientLogin: ClientLogin;
  client: Client;
  clientSub: Subscription;
  getClient(){
    this.clientSub = this.parentService.getClientLogin(this.currentUser.id).subscribe(client=>{
      this.clientLogin = client;
      this.client = client.clientId;
      this.getWallet();
      this.getPendingFee();
      this.getAssessmentPendingFee();
      this.getLmc();
      this.getLeaves();
      this.getGroupPendingFee();
    });
  }

  viewMore(){
    this.router.navigateByUrl('/parent/profile/edit/' + this.client._id)
  }

  editPass(){
    const dialogRef = this.dialog.open(EditLoginComponent, {
      width: '500px',
      data: {id: this.currentUser.id, clientId: this.client._id}
    });
    dialogRef.afterClosed().subscribe(result =>{
      this.getClient()
    })
  }

  walletAmount: any;
  walletSub: Subscription;
  getWallet(){
    this.walletSub = this.adminService.getWalletByClient(this.client._id).subscribe(result =>{
      if(!result) return this.walletAmount = 0;
      return this.walletAmount = result.balanceAmount;
    });
  }

  sMaster: SessionMaster[];
  pendingSessions: SessionMaster[];
  pendingAmount: number = 0;
  sFeeSub: Subscription;
  getPendingFee(){
    // this.sFeeSub = this.therapistService.getSessionMaster().subscribe((res)=>{
      combineLatest(
        this.therapistService.getSessionMaster()
        .pipe(map((x: SessionMaster[]) =>x.filter((y) =>
              y.sessionStatus.toLowerCase() === 'session' &&
              y.session_id.clientName._id === this.client._id)
          )
        ),
        this.therapistService.getSessionMaster()
        .pipe(map((x: SessionMaster[]) => x.filter((y) =>
              y.sessionStatus.toLowerCase() === 'leavsession' &&
              y.leave_session_id.clientName._id === this.client._id)
          )
        ),
        this.therapistService.getSessionMaster()
        .pipe(map((x: SessionMaster[]) =>x.filter((y) =>
              y.sessionStatus.toLowerCase() === 'compensationsession'&&
              y.compensation_session_id.clientName._id === this.client._id)
          )
        )).subscribe(([s, z, x]) => {
          this.sMaster = [...s, ...z, ...x];


        this.pendingSessions = this.sMaster.filter((x:SessionMaster) => x.feeStatus == false)
        if(this.pendingSessions.length === 0)  { this.pendingAmount = 0}
        else{
          for(let i = 0; i < this.pendingSessions.length; i++){
            this.pendingAmount = this.pendingAmount + this.pendingSessions[i].sessionFee
          }
        }

    })
  }

  aMaster: AssessmentMaster[];
  aSessions: AssessmentMaster[];
  assessmentAmount: number = 0;
  aFeeSub: Subscription;
  getAssessmentPendingFee(){
    combineLatest(
      this.therapistService.getAssessmentMaster()
      .pipe(map((x: AssessmentMaster[]) =>x.filter((y) =>
            y.sessionStatus.toLowerCase() === 'session' &&
            y.assessment_id.clientName._id === this.client._id)
        )
      ),
      this.therapistService.getAssessmentMaster()
      .pipe(map((x: AssessmentMaster[]) => x.filter((y) =>
            y.sessionStatus.toLowerCase() === 'leavsession' &&
            y.leave_session_id.clientName._id === this.client._id)
        )
      ),
      this.therapistService.getAssessmentMaster()
      .pipe(map((x: AssessmentMaster[]) =>x.filter((y) =>
            y.sessionStatus.toLowerCase() === 'compensationsession'&&
            y.compensation_assessment_id.clientName._id === this.client._id)
        )
      )).subscribe(([s, z, x]) => {
        this.aMaster = [...s, ...z, ...x];

      this.aSessions = this.aMaster.filter((x:AssessmentMaster) => x.feeStatus == false)
      if(this.aSessions.length === 0)  { this.assessmentAmount = 0}
      else{
        for(let i = 0; i < this.aSessions.length; i++){
          this.assessmentAmount = this.assessmentAmount + this.aSessions[i].assessmentFee

        }
      }
    })
  }

  gMaster: GroupMaster[];
  groupAmount: number = 0;
  gFeeSub: Subscription;
  getGroupPendingFee(){
    this.gFeeSub = this.adminService.getGroupMaster().subscribe((res)=>{

      this.gMaster = res.filter((x:GroupMaster) =>
        x.clientName.filter(c => c.clientId._id === this.client._id && c.feeStatus === false)
      )
      if(this.gMaster.length === 0)  { this.groupAmount = 0}
      else{
        for(let i = 0; i < this.gMaster.length; i++){
          this.groupAmount = this.groupAmount + this.gMaster[i].clientName.find(c => c.clientId._id === this.client._id).sessionFee
        }
      }
    })
  }

  lmcCount: number = 0;
  lmcSub: Subscription;
  lmcFeeCount: number = 0;
  getLmc(){
    this.lmcSub = this.adminService.getLmc().subscribe(res =>{
      let lmc = res.filter(x => x.clientId._id === this.client._id)
      this.lmcCount = lmc.length

      let pendFee = lmc.filter(x => x.feeStatus === false)
      this.lmcFeeCount = pendFee.length
    })
  }

  leavesCount: number = 0;
  leaveSub: Subscription;
  getLeaves(){
    this.leaveSub = this.adminService.getLeave().subscribe(res =>{
      let leave = res.filter(x => x.clientId._id === this.client._id)
      this.leavesCount = leave.length
    })
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

  userForm = this.fb.group({
    cloudinary_id : [''],
    image_url : ['']
  });

  onUpload(){
    this.uploadStatus = false
    this.adminService.uploadUserImage(this.file).subscribe(res=>{
      this.userForm.patchValue({
        cloudinary_id : res.public_id,
        image_url: res.url
      })
      this.adminService.editUserUploadImage(this.userForm.getRawValue(), this.currentUser).subscribe(res=>{
        this.getClient()
      })
    })
  }

}
