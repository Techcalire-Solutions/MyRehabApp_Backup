import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Rehab Master';
  // mobile = false;

  ngOnInit(){
    // if(window.screen.width<460){
    //   this.mobile = true;
    // }
  }
}
