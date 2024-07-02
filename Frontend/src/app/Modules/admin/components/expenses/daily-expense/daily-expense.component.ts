import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AdminService } from '../../../admin.service';
import { Category } from '../../../models/category';
import { DailyExpense } from '../../../models/dailyExpense';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { User } from '../../../models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily-expense',
  templateUrl: './daily-expense.component.html',
  styleUrls: ['./daily-expense.component.scss']
})
export class DailyExpenseComponent implements OnInit {
  dailyexpenseForm = this.fb.group({
    date: ['', Validators.required],
    expense: ['',[Validators.required]],
    type:['',Validators.required],
    collectedFrom:[],
    otherExpense:['']
  });

  form = this.fb.group({
    startDate : [],
    endDate : []
  })

  displayedColumns : string[] = ['date', 'type', 'expense', 'action']

  types = [
    {name: 'Salary'},
    {name: 'Electricity'},
    {name: 'Water'},
    {name: 'Rent'},
    {name: 'Others'}
  ]

  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog,
    private datePipe: DatePipe) { }

  ngOnDestroy(): void {
    this.expenseSub.unsubscribe()
  }

  ngOnInit(): void {
    this.expenseSub = this.getDailyExpense()
    this.getUser()
  }

  user : any
  admin : User[] = []
  currentAdmin : any
  userId : String
  adminS: Subscription;
  getUser(){
    let token = localStorage.getItem('token')
      this.user = JSON.parse(token)?.username

      this.adminS = this._http.getAdmin().subscribe((res)=>{
        this.admin = res

        this.currentAdmin = this.admin.find(x => x.name == this.user)

        if(this.currentAdmin){
          this.userId = this.currentAdmin._id
        }
      })
  }

  filterRows(){
    // this.expense = this.expense.filter(x=> this.form.get('selectedStartDate').value >= x.date <= this.form.get('selectedEndDate').value)
    this._http.getDailyExpenseBydate(this.form.getRawValue()).subscribe(x=>{
      this.filtered = x;
      this.form.reset()
    })
  }

  dailyexpense :any;
  submit: Subscription;
  onSubmit(){
    let data = {
      date: this.datePipe.transform(this.dailyexpenseForm.get('date').value, 'yyyy-MM-dd'),
      expense:  this.dailyexpenseForm.get('expense').value,
      type: this.dailyexpenseForm.get('type').value,
      otherExpense: this.dailyexpenseForm.get('otherExpense').value,
      collectedFrom: this.userId
    }
    this.submit = this._http.addDailyExpense(data).subscribe((res)=>{
      this.dailyexpense = res;
      this._snackBar.open("DailyExpense added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.dailyexpenseForm.reset()
    this.getDailyExpense()
  }


  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.filtered.filter(element =>
        new Date(element.date).toISOString().toLowerCase().includes(filterValue)
        || element.type.toLowerCase().includes(filterValue)
    )}

    else{
      this.getDailyExpense();
    }
  }

  expense : DailyExpense[] = [];
  expenseSub: Subscription;
  getDailyExpense(){
    return this._http.getDailyExpense().subscribe((dailyexpense)=>{
      this.expense = dailyexpense;
      this.filtered = this.expense
    })
  }

  isEdit = false;
  dailyexpenseId: string;
  editExpense(id){
    this.isEdit = true;

    let dailyexpense = this.expense.find(x => x._id == id);

    let date: any = dailyexpense.date;
    let expense = dailyexpense.expense.toString();
    let type = dailyexpense.type.toString();

    this.dailyexpenseForm.patchValue({
      date: date,
      expense: expense,
      type: type
    })
    this.dailyexpenseId = id
  }

  aEdit: Subscription;
  editFunction(){
    this.isEdit = false;
    let data = {
      date : this.dailyexpenseForm.get('date').value,
      expense : this.dailyexpenseForm.get('expense').value,
      type : this.dailyexpenseForm.get('type').value,
    }
    this.aEdit = this._http.updateDailyExpense(data, this.dailyexpenseId).subscribe((res) =>{
      this._snackBar.open("Daily Expense updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error.error.text)
      alert(error)
    }))
  }

  delete: Subscription;
  deleteDailyExpense(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this._http.deleteDailyExpense(id).subscribe((dailyexpense)=>{
          this.getDailyExpense()
          this._snackBar.open("DailyExpense deleted successfully...","" ,{duration:3000})
        },(error=>{
          console.log(error)
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
    this.clearControls()
  }

  expenseArray: any[] = [];
  makeExcel(){
    // Initialize an array of excluded field names
    const excludedFields = [
      '__v',
      '_id'
    ];

    // Get the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Specify the file name with the current date
    const fileName = `expense_${formattedDate}.csv`;

    // Get the headings based on the first expense object
    const expense = this.filtered[0];
    const headings = Object.keys(expense).filter(
      (key) => !excludedFields.includes(key)
    );

    const formattedHeadings = headings.map(
      (heading) => `-- ${heading.toUpperCase()} --`
    );

    // Push the headings to the expenseArray
    this.expenseArray.push(formattedHeadings);

    // Iterate over each expense in the array
    for (let i = 0; i < this.filtered.length; i++) {
      const expense = this.filtered[i];
      const newRow: any = [];

      // Iterate over each property of the expense object
      for (let key of headings) {
        let value = expense[key];
        if(key === 'collectedFrom'){
          value = this.filtered[i].collectedFrom.name;
        }
        newRow.push(value);
      }

      this.expenseArray.push(newRow);
    }

    // Generate CSV string
    let csvString = '';
    this.expenseArray.forEach((rowItem: any) => {
      rowItem.forEach((colItem: any) => {
        csvString += colItem + ',';
      });
      csvString += '\r\n';
    });

    // Create a download link for the CSV file
    csvString = 'data:application/csv,' + encodeURIComponent(csvString);
    const link = document.createElement('a');
    link.setAttribute('href', csvString);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    this.expenseArray = [];
  }
}
