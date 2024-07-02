import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Celebrations } from '../../../models/celebrations';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
})
export class ViewMoreComponent implements OnInit {

  constructor( private route: ActivatedRoute, private adminservice: AdminService) { }

  experiences: any[] = [];
  qualifications: any[] = [];
  users: User;
  id: string
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getUser(this.id)
    this.getCelebrations(this.id)
  }

  userSub: Subscription;
  getUser(id: string){
    this.adminservice.getTherapistById(id).subscribe(res=>{
      this.users = res
      this.experiences = res.experiences;
      this.qualifications = res.qualifications;
    })
  }

  celeb: Celebrations
  getCelebrations(id: string){
    this.adminservice.getClebrationBuUserId(id).subscribe(res=>{
      this.celeb = res;
    })
  }
}
