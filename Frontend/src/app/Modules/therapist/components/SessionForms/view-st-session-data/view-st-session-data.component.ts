import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { StSessionData } from '../../../models/stSessionData';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { Activity } from '../../../models/activity';

@Component({
  selector: 'app-view-st-session-data',
  templateUrl: './view-st-session-data.component.html',
  styleUrls: ['./view-st-session-data.component.scss']
})
export class ViewStSessionDataComponent implements OnInit, OnDestroy {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private fb: FormBuilder, private _http: AdminService, private _snackBar: MatSnackBar,
    private therapistService: TherapistService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
  }
  sessionId: string
  infoSubscription: Subscription;
  sessionMasterId: any

  
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
    this.sessionId = this.route.snapshot.params['id'];

    this.therapistService.getStSessionDataId(this.sessionId).subscribe((st) => {
      this.sessionMasterId = st.session_master_id;
      this.getActivityById();
    });
  }



  stSessionData: StSessionData[] = [];
  stData: StSessionData;
  getInfo() {
    return this.therapistService.getStSessionDataId(this.route.snapshot.params['id']).subscribe((st) => {
      this.sessionMasterId = st.session_master_id
      this.stData = st
      this.stSessionData.push(st)
    })
  }

  logRemarks() {
  }


  getAllActivity() {
    this.therapistService.getActivity().subscribe((res) => {
    })
  }



  activityDetails: any[] = [];
  activities: Activity
  getActivityById() {
  this.therapistService.getActivitybyId(this.sessionMasterId).subscribe(
      (res) => {
        if (res && res.activityDetails) {
          this.activities = res;
          this.activityDetails = res.activityDetails;

        } else {
          console.error("Invalid activity response:", res);
        }
      },
      (error) => {
        console.error("Error fetching activity:", error);
      }
    );
  }
}















