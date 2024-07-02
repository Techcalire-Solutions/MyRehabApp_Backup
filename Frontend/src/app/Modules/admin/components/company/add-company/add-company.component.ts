import { AddAssessmentDialogueComponent } from './../../sessions/add-assessment-dialogue/add-assessment-dialogue.component';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { AdminService } from '../../../admin.service';
import { Company } from '../../../models/company';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AddCompanyComponent>, private adminService: AdminService,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
  ){}

  ngOnDestroy() {
    this.storeSubscription?.unsubscribe();
    this.uploadSubscription?.unsubscribe();
    this.submit?.unsubscribe();
    // this.storeSub?.unsubscribe();
  }

  companyForm = this.fb.group({
    companyName: ['', Validators.required],
    locationName: ['', Validators.required],
    companyInChargeName: ['', Validators.required],
    gstNo: ['']
  });

  displayedColumns : string[] = ['id','companyName', 'manage']

  addStatus!: string;
  editstatus!: boolean;

  ngOnInit(): void {
    this.getCompanies()
  }

  submit!: Subscription
  uploadSubscription!: Subscription;
  onSubmit(){
    if(!this.companyForm.valid){
      return alert('Please fill the form first')
    }
  
    this.submit = this.adminService.addCompany(this.companyForm.getRawValue()).subscribe((response)=>{
   
      this._snackBar.open("Company added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }


  clearControls(){
    this.getCompanies()
    this.companyForm.reset()
    this.companyForm.setErrors(null)
    Object.keys(this.companyForm.controls).forEach(key=>{this.companyForm.get(key)?.setErrors(null)})
    // this.file = null;
    // this.imageUrl = '';
  }

  company: Company[] = [];
  storeSubscription? : Subscription
  dataSource! : MatTableDataSource<any>
  getCompanies(){
    this.storeSubscription = this.adminService.getCompany().subscribe((res:any)=>{
      this.filtered = res;
      this.company = this.filtered;
    })
  }

  filtered!: any[];
  applyFilter(event: Event): void {
    if((event.target as HTMLInputElement).value.trim() === '') {
      this.getCompanies();
    }else{
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.filtered = this.company.filter(element =>
        element.companyName.toLowerCase().includes(filterValue)
        || element._id.toString().includes(filterValue)
        // || element.status.toString().includes(filterValue)
    );
    }
  }

  isImageEnlarged: boolean[] = [];
  enlargeImage(index: number, isEnlarged: boolean): void {
    this.isImageEnlarged[index] = isEnlarged;
  }

  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  filterValue = "";
  search() {
    if (this.filterValue) {
      this.getCompanies();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getCompanies();
    }
  }

  delete!: Subscription;
  deleteCompany(id : any){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this.adminService.deleteCompany(id).subscribe((res)=>{
          this.getCompanies()
          this._snackBar.open("Company deleted successfully...","" ,{duration:3000})
        },(error=>{
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
  }

  isEdit = false;
  comId : any;
  editCompany(id : string){
    this.comId = id;
    this.isEdit = true;
    this.adminService.getCompanyById(id).subscribe(company=>{
      let com = company;

      let companyName = com.companyName;
      let companyInChargeName = com.companyInChargeName;
      let gstNo = com.gstNo;
      let location = com.locationName;

      this.companyForm.patchValue({
        companyName: companyName,
        companyInChargeName: companyInChargeName,
        gstNo: gstNo,
        locationName: location
      })
    });
  }

  edit!:Subscription;
  editFunction(){
    if(!this.companyForm.valid){
      return alert('Please fill the form first')
    }
      let data={
        companyName  : this.companyForm.get('companyName')?.value,
        locationName  : this.companyForm.get('locationName')?.value,
        companyInChargeName : this.companyForm.get('companyInChargeName')?.value,
        phoneNumber : this.companyForm.get('phoneNumber')?.value
      }

      this.submit = this.adminService.updateCompany(data, this.comId).subscribe((res)=>{

        this._snackBar.open("company updated successfully...","" ,{duration:3000})
        this.getCompanies();
        this.dialogRef.close();
        this.clearControls();
      },(error=>{
            alert(error.message)
          }))
    }


  onCancelClick(): void {
    this.dialogRef.close();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getCompanies();
  }

  clearFileInput() {
    // this.imageUrl = '';
  }
}


