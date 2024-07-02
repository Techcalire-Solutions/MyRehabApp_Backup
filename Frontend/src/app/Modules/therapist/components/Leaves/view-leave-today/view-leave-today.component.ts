import { Leaves, Slots } from 'src/app/Modules/admin/models/leaves';
import { Subscription, map } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-leave-today',
  templateUrl: './view-leave-today.component.html',
  styleUrls: ['./view-leave-today.component.scss']
})
export class ViewLeaveTodayComponent implements OnInit, OnDestroy {

  constructor(private adminService: AdminService, private datePipe: DatePipe) { }
  ngOnDestroy(): void {
    this.leaveSubscription.unsubscribe()
  }

  date: any
  weekDay: any
  ngOnInit(): void {
    this.leaveSubscription = this.getLeave()

    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    let day = new Date().toLocaleString('default',{weekday:'long'})
    this.weekDay = day
  }

  displayedColumns : String[] = ['clientId', 'fromDate', 'toDate', 'slotId']

  leaveSubscription: Subscription
  leave: Leaves[] = [];
  slots: Slots[] = []
  getLeave(){
    return this.adminService.getLeave()
    .pipe(map((x)=> x.filter((l)=>{
      return this.datePipe.transform(l.fromDate, 'yyyy-MM-dd')<= this.date && this.datePipe.transform(l.toDate, 'yyyy-MM-dd')>= this.date
    })))
    .subscribe((res)=>{
      this.leave = res
    })
  }
}
