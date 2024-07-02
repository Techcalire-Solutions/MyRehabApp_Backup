import { Pipe, PipeTransform } from '@angular/core';
import { Slot } from '../models/slot';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(slot : Slot[], status : boolean): any {
     return slot.find((x)=>{
       return x.slotStatus == status
    })
  }

}
