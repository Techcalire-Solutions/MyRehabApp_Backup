import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { MedicalReportViewerComponent } from '../../../../admin/components/clients/medical-report-viewer/medical-report-viewer.component';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit, OnDestroy {

  constructor(private _http:TherapistService, private adminService:AdminService, private router:Router, private route:ActivatedRoute, public dialog:MatDialog) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
  }

  panelOpenState = false;

  client :any
  age : any;
  showAge : any;

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  getInfo(){
    return this.adminService.getClientInfo(this.route.snapshot.paramMap.get('id')).subscribe((client)=>{
      this.client = client
    })
  }

  ageCalculator(dob){
      const convertAge = new Date(dob);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      let age = this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      const months = Math.floor((timeDiff % (1000 * 3600 * 24 * 365)) / (1000 * 3600 * 24 * 30));
      let year = age + 'years and' + months + 'months'
      return year;
    }

  openDialog(path){
      this.dialog.open(MedicalReportViewerComponent,{data:{url:path}})
    }

}
