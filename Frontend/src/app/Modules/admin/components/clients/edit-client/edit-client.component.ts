import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { MedicalReportViewerComponent } from '../medical-report-viewer/medical-report-viewer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit,OnDestroy {

  constructor(private adminService : AdminService, private route : ActivatedRoute, public dialog:MatDialog,
    private router : Router) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
  }

  id : any;
  infoSubscription: Subscription;
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']
    this.infoSubscription = this.getInfo()
  }

  panelOpenState = false;
  panelOpenSchool = false;
  panelOpenRoutine = false;

  client : any;
  getInfo(){
    return this.adminService.getClientInfo(this.route.snapshot.paramMap.get('id')).subscribe((client)=>{
      this.client = client
  
    })
  }

  showAge : any;
  ageCalculator(dob){
      const convertAge = new Date(dob);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      let age = this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
      return age ;
    }

  openDialog(path){
    this.dialog.open(MedicalReportViewerComponent,{data:{url:path}})
  }

  editPersonalForm(){
    this.router.navigateByUrl('/admin/editclientpersonalform/' + this.id)
  }

  editMedicalForm(){
    this.router.navigateByUrl('/admin/editclientmedicalform/' + this.id)
  }

  editSchoolForm(){
    this.router.navigateByUrl('/admin/editclientschoolform/' + this.id)
  }

  editRoutineForm(){
    this.router.navigateByUrl('/admin/editclientroutinesform/' + this.id)
  }
}
