import { Category } from '../../../models/category';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Validators, FormBuilder } from '@angular/forms';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  ngOnDestroy(){
    this.cat.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.edit){
      this.edit.unsubscribe();
    }
    if(this.delete){
      this.delete.unsubscribe();
    }
  }

  categoryForm = this.fb.group({
    therapyName: ['', Validators.required],
    abbreviation: ['', Validators.required]
  });

  displayedColumns: string[] = [ 'therapyName', 'abbreviation', 'action'];

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCategory();
  }

  user :any;
  submit: Subscription;
  onSubmit(){
    let data = {
      therapyName: this.categoryForm.get(['therapyName']).value,
      abbreviation: this.categoryForm.get(['abbreviation']).value,
    }
    this.submit = this._http.addCategory(this.categoryForm.getRawValue()).subscribe((res)=>{
      this.user = res;
      this._snackBar.open("Category added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  category: Category[] = []
  cat: Subscription;
  getCategory(){
   this.cat = this._http.getCategory().subscribe((res)=>{
    this.category = res;
    this.filtered = this.category
   })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.category.filter(element =>
      element.therapyName.toLowerCase().includes(filterValue)
      || element.abbreviation.toLowerCase().includes(filterValue)
    )}

    else{
      this.getCategory();
    }
  }

  isEdit = false;
  categoryId : '';
  editCategory(id){
    this.isEdit = true;
    let catName
    let catAbbreviation
    //Get the product based on the ID
    let cat = this.category.filter((x)=>x._id == id)
    catName = cat[0].therapyName
    catAbbreviation = cat[0].abbreviation

    this.categoryForm.patchValue({
      therapyName: catName,
      abbreviation: catAbbreviation
    })

    this.categoryId = id;
  }

  edit: Subscription;
  editFunction(){
    this.isEdit = false;
    let data = {
      therapyName : this.categoryForm.get('therapyName').value,
      abbreviation : this.categoryForm.get('abbreviation').value,
    }
    this.edit = this._http.editCategory(data, this.categoryId).subscribe((res)=>{
    this._snackBar.open("Category updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  delete: Subscription;
  deleteCategory(id: String){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.delete = this._http.deleteCategory(id).subscribe((res)=>{
          this.getCategory()
          this._snackBar.open("Category deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
        this.getCategory()
      }})
  }

  clearControls(){
    this.categoryForm.reset()
    this.getCategory()
  }

}
