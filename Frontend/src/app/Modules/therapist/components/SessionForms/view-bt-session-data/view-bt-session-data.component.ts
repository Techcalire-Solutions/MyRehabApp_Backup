import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BtSessionData } from '../../../models/btSessionData';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { Activity } from '../../../models/activity';

@Component({
  selector: 'app-view-bt-session-data',
  templateUrl: './view-bt-session-data.component.html',
  styleUrls: ['./view-bt-session-data.component.scss']
})
export class ViewBtSessionDataComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private therapistService: TherapistService) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
  }

  sessionId: string;
  infoSubscription: Subscription;
  btSessionData: BtSessionData[] = [];
  btData: BtSessionData;
  sessionMasterId: any
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
    this.sessionId = this.route.snapshot.params['id']


    this.therapistService.getBtSessionDataId(this.sessionId).subscribe((st) => {
      this.sessionMasterId = st.session_master_id;

      this.getActivityById();
    });
  }

  getInfo() {
    return this.therapistService.getBtSessionDataId(this.route.snapshot.params['id']).subscribe((bt) => {
      this.btData = bt
      this.sessionMasterId = bt.session_master_id


    })
  }

  activityDetails: any[] = [];

  activities: Activity

  getActivityById() {

    this.therapistService.getActivityBySessionMasterId(this.sessionMasterId).subscribe(
      (res) => {



        if (res && res.activityDetails) {
          this.activities = res;
          this.activityDetails = res.activityDetails;

        } else {

        }
      },
      (error) => {

      }
    );
  }

}
