import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Category } from 'src/app/Modules/admin/models/category';
import { Client } from 'src/app/Modules/admin/models/client';
import { Session } from 'src/app/Modules/admin/models/session';
import { Slot } from 'src/app/Modules/admin/models/slot';
import { User } from 'src/app/Modules/auth/models/User';
import { MedicalReportViewerComponent } from '../../../../admin/components/clients/medical-report-viewer/medical-report-viewer.component';
import { OtSessionData } from '../../../models/otSessionData';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-ot-session-data',
  templateUrl: './view-ot-session-data.component.html',
  styleUrls: ['./view-ot-session-data.component.scss']
})
export class ViewOtSessionDataComponent implements OnInit, OnDestroy {


  otSessionData : OtSessionData[]=[];
  otData : OtSessionData;


  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar,
    private therapistService:TherapistService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  getInfo(){
    return this.therapistService.getOtSessionDataId(this.route.snapshot.params['id']).subscribe((ot)=>{
      this.otData = ot
      this.otSessionData.push(ot)
    })
  }

  logRemarks(){
  }
}

