import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { Leaves, Slots } from 'src/app/Modules/admin/models/leaves';
import { Lmc } from 'src/app/Modules/admin/models/lmc';

@Component({
  selector: 'app-view-lmc-today',
  templateUrl: './view-lmc-today.component.html',
  styleUrls: ['./view-lmc-today.component.scss']
})
export class ViewLmcTodayComponent implements OnInit {

  constructor(private adminService: AdminService, private datePipe: DatePipe) { }
  ngOnDestroy(): void {
    this.leaveSubscription.unsubscribe()
  }

  date: any
  weekDay: any
  ngOnInit(): void {
    this.leaveSubscription = this.getLmc()

    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
  }

  displayedColumns : String[] = ['clientId', 'date', 'slotId']

  leaveSubscription: Subscription
  leave: Lmc[] = [];
  slots: Slots[] = []
  getLmc(){
    return this.adminService.getLmc()
    .pipe(map((x)=> x.filter((l)=>{
      return this.datePipe.transform(l.date, 'yyyy-MM-dd') == this.date
    })))
    .subscribe((res)=>{
      this.leave = res
    })
  }
}
