import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientRegistrationComponent } from './client-registration/client-registration.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { PoliciesComponent } from './policies/policies.component';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';





@NgModule({
  declarations: [
    AppComponent,
    ClientRegistrationComponent,
    PoliciesComponent
 

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatStepperModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatCheckboxModule,
    FormsModule,
    MatSnackBarModule,
    PdfViewerModule 
 



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
