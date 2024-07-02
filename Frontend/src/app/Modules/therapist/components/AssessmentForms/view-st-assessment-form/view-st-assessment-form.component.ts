import { StAssessmentForm } from '../../../models/stAssessmentForm';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-view-st-assessment-form',
  templateUrl: './view-st-assessment-form.component.html',
  styleUrls: ['./view-st-assessment-form.component.scss']
})
export class ViewStAssessmentFormComponent implements OnInit, OnDestroy {

  constructor(private therapistService:TherapistService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  stData : StAssessmentForm;
  getInfo(){
    return this.therapistService.getStAssessmentId(this.route.snapshot.params['id']).subscribe((st)=>{
      this.stData = st
    })
  }
}
