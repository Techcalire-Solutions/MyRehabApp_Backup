import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { SeSessionData } from '../../../models/seSessionData';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-se-session-data',
  templateUrl: './view-se-session-data.component.html',
  styleUrls: ['./view-se-session-data.component.scss'],
})
export class ViewSeSessionDataComponent implements OnInit, OnDestroy {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar,
    private therapistService:TherapistService, private route: ActivatedRoute, private router: Router) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
  }

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  displayedColumns: string[] = ['activities','notes'];

  seData : SeSessionData;
  seSessionData : SeSessionData[]=[]
  getInfo(){
    return this.therapistService.getSeSessionDataId(this.route.snapshot.params['seId']).subscribe((ot)=>{
      this.seData = ot
    })
  }

  editSeDataSession(id){
    let sessionId = this.route.snapshot.params['sessionId']
    let seId = this.route.snapshot.params['seId']
    this.router.navigateByUrl('therapist/editsesession/'+sessionId + '/' + seId + '/' + id)
  }

}
