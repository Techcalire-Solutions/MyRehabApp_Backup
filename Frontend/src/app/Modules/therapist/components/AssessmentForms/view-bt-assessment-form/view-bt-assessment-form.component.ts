import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BtAssessmentForm } from '../../../models/btAssessmentForm';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-bt-assessment-form',
  templateUrl: './view-bt-assessment-form.component.html',
  styleUrls: ['./view-bt-assessment-form.component.scss']
})
export class ViewBtAssessmentFormComponent implements OnInit, OnDestroy {

  constructor(private therapistService:TherapistService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  btData : BtAssessmentForm;
  getInfo(){
    return this.therapistService.getBtAssessmentId(this.route.snapshot.params['id']).subscribe((bt)=>{
      this.btData = bt
    })
  }
}
