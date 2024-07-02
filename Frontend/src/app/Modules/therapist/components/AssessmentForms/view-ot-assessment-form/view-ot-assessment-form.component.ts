import { OtAssessment } from '../../../models/otAssessmentForm';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-ot-assessment-form',
  templateUrl: './view-ot-assessment-form.component.html',
  styleUrls: ['./view-ot-assessment-form.component.scss']
})
export class ViewOtAssessmentFormComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  panelOpenStateComponents = false;

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar,
    private therapistService:TherapistService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  otSessionData : OtAssessment[]=[];
  otData : OtAssessment;
  getInfo(){
    return this.therapistService.getOtAssessmentId(this.route.snapshot.params['id']).subscribe((ot)=>{
      this.otData = ot
    })
  }

}
