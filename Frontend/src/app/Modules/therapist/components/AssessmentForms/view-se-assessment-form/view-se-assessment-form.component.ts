import { SeAssessment } from '../../../models/seAssessmentForm';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-se-assessment-form',
  templateUrl: './view-se-assessment-form.component.html',
  styleUrls: ['./view-se-assessment-form.component.scss']
})
export class ViewSeAssessmentFormComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  panelOpenStateEducation = false;

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar,
    private therapistService:TherapistService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  seSessionData : SeAssessment[]=[];
  seData : SeAssessment;
  getInfo(){
    return this.therapistService.getSeAssessmentId(this.route.snapshot.params['id']).subscribe((ot)=>{
      this.seData = ot
    })
  }

}
