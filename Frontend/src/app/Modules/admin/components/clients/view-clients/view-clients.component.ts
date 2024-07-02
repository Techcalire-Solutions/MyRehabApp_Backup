import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { FormControl } from '@angular/forms';
import { startWith, map, Observable, Subscription } from 'rxjs';
import { Client } from '../../../models/client';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss'],
})
export class ViewClientsComponent implements OnInit {
  ngOnDestroy() {
    // this.clientSub.unsubscribe();
  }

  displayedColumns: string[] = [
    'serialNumber',
    'date',
    'clientID',
    'firstName',
    'emergencyNumber',
  
    'status',
    'view',
    'action',
  ];

  constructor(
    private adminService: AdminService, private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  medical: any = [];
  school: any = [];
  routine: any = [];
  ngOnInit(): void {
    this.getClients();
  }

  clients: Client[] = [];
  dataSource!: MatTableDataSource<any>;
  getClients() {
    return this.adminService.getPaginatedClient(this.filterValue, this.currentPage, this.pageSize).subscribe((res: any) => {
        this.clients = res.items;
        console.log("CLIENTS",this.clients)
        this.totalItems = res.count;
      });
  }
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getClients();
  }

  filterValue = '';
  search() {
    if (this.filterValue) {
      this.getClients();
    }
  }

  onInputChange(value: any) {
    this.filterValue = value;
    if (!this.filterValue) {
      this.getClients();
    }
  }

  // myControl = new FormControl<string | Client>("");
  // filteredOptions: Client[] = [];
  // filterOptions(event: Event) {
  //   let value = (event.target as HTMLInputElement).value;
  //   if(value){
  //     this.filteredOptions = this.client.filter((option) => {
  //       if (
  //         (option.firstName &&
  //           option.firstName.toLowerCase().includes(value?.toLowerCase()))
  //           ||(option.emergencyNumber && option.emergencyNumber.toString().includes(value?.toLowerCase()))
  //           ||(option.email && option.email.toLowerCase().includes(value?.toLowerCase()))
  //           ||(option.status && option.status.toLowerCase().includes(value?.toLowerCase()))
  //       ) {
  //         return true;
  //       } else {
  //         return null;
  //       }
  //     });

  //   }
  //   else{
  //     this.getClients()
  //   }

  // }

  client: any;
  getFeesByClient(id: String) {
    this.client = this.clients.filter((x) => x._id == id);
  }

  // clientSub: Subscription;
  // getClients(){
  //   this.clientSub = this.adminService.getClients().subscribe((clients)=>{
  //     this.clients = clients
  //     this.client = this.clients
  //     this.filteredOptions = this.client.slice(0, this.pageSize);
  //     for (let i = 0; i < this.clients.length; i++){
  //       this.medical.push(this.clients[i].medical)
  //       this.school.push(this.clients[i].school)
  //       this.routine.push(this.clients[i].routine)
  //     }
  //   })
  // }

  // clients : any  = [];
  viewClient(id) {
    let client = this.clients.find((x) => {
      return x._id === id;
    });
    this.router.navigateByUrl('admin/clientinfo/' + id);
  }

  viewLogin(id:string){
    const dialogRef = this.dialog.open(LoginComponent,{
      data: {id: id, type: 'view'}
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getClients();
    })
  }

  editClient(id) {
    this.router.navigateByUrl('admin/editclients/' + id);
  }

  clientArray: any = [];
  medicalArray: any = [];
  schoolArray: any = [];
  routineArray: any = [];
  makeExcel() {
    // Initialize an array of excluded field names
    const excludedFields = [
      'familyMembers',
      'medical',
      'school',
      'routine',
      '__v',
    ];

    // Get the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Specify the file name with the current date
    const fileName = `clientdata_${formattedDate}.csv`;

    // Get the headings based on the first client object
    const firstClient = this.clients[0];
    const headings = Object.keys(firstClient).filter(
      (key) => !excludedFields.includes(key)
    );

    const formattedHeadings = headings.map(
      (heading) => `-- ${heading.toUpperCase()} --`
    );

    // Push the headings to the clientArray
    this.clientArray.push(formattedHeadings);

    // Iterate over each client in the array
    for (let i = 0; i < this.clients.length; i++) {
      const client = this.clients[i];
      const newRow: any = [];

      // Iterate over each property of the client object
      for (let key of headings) {
        const value = client[key];
        newRow.push(value);
      }

      this.clientArray.push(newRow);
    }

    // Generate CSV string
    let csvString = '';
    this.clientArray.forEach((rowItem: any) => {
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

    this.clientArray = [];

    //MEDICAL

    // Get the headings based on the first client object
    const firstClientMedical = this.medical[0];
    const headingMedical = Object.keys(firstClientMedical);
    const formattedHeadingsMedical = headingMedical.map(
      (headingMedical) => `-- ${headingMedical.toUpperCase()} --`
    );

    // Push the headings to the medicalArray
    this.medicalArray.push(formattedHeadingsMedical);

    // Iterate over each client in the array
    for (let i = 0; i < this.clients.length; i++) {
      const client = this.medical[i];
      const newRow: any = [];

      // Iterate over each property of the client object
      for (let key of headingMedical) {
        const value = client[key];
        newRow.push(value);
      }

      this.medicalArray.push(newRow);
    }

    // Generate CSV string
    let csvStringMedical = '';
    this.medicalArray.forEach((rowItem: any) => {
      rowItem.forEach((colItem: any) => {
        csvStringMedical += colItem + ',';
      });
      csvStringMedical += '\r\n';
    });

    // Specify the file name with the current date
    const fileNameMedical = `clientmedicaldata_${formattedDate}.csv`;

    // Create a download link for the CSV file
    csvStringMedical =
      'data:application/csv,' + encodeURIComponent(csvStringMedical);
    const linkMedical = document.createElement('a');
    linkMedical.setAttribute('href', csvStringMedical);
    linkMedical.setAttribute('download', fileNameMedical);
    document.body.appendChild(linkMedical);
    linkMedical.click();

    this.clientArray = [];

    //SCHOOL

    // Get the headings based on the first client object
    const firstClientSchool = this.school[0];
    const headingSchool = Object.keys(firstClientSchool);
    const formattedHeadingsSchool = headingSchool.map(
      (headingSchool) => `-- ${headingSchool.toUpperCase()} --`
    );

    // Push the headings to the medicalArray
    this.schoolArray.push(formattedHeadingsSchool);

    // Iterate over each client in the array
    for (let i = 0; i < this.clients.length; i++) {
      const client = this.school[i];
      const newRow: any = [];

      // Iterate over each property of the client object
      for (let key of headingSchool) {
        const value = client[key];
        newRow.push(value);
      }

      this.schoolArray.push(newRow);
    }

    // Generate CSV string
    let csvStringSchool = '';
    this.schoolArray.forEach((rowItem: any) => {
      rowItem.forEach((colItem: any) => {
        csvStringSchool += colItem + ',';
      });
      csvStringSchool += '\r\n';
    });

    const fileNameSchool = `clientschooldata_${formattedDate}.csv`;

    // Create a download link for the CSV file
    csvStringSchool =
      'data:application/csv,' + encodeURIComponent(csvStringSchool);
    const linkSchool = document.createElement('a');
    linkSchool.setAttribute('href', csvStringSchool);
    linkSchool.setAttribute('download', fileNameSchool);
    document.body.appendChild(linkSchool);
    linkSchool.click();

    this.clientArray = [];

    //ROUTINE

    // Get the headings based on the first client object
    const firstClientRoutine = this.routine[0];
    const headingRoutine = Object.keys(firstClientRoutine);
    const formattedHeadingsRoutine = headingRoutine.map(
      (headingRoutine) => `-- ${headingRoutine.toUpperCase()} --`
    );

    // Push the headings to the medicalArray
    this.routineArray.push(formattedHeadingsRoutine);

    // Iterate over each client in the array
    for (let i = 0; i < this.clients.length; i++) {
      const client = this.routine[i];
      const newRow: any = [];

      // Iterate over each property of the client object
      for (let key of headingRoutine) {
        const value = client[key];
        newRow.push(value);
      }

      this.routineArray.push(newRow);
    }

    // Generate CSV string
    let csvStringRoutine = '';
    this.routineArray.forEach((rowItem: any) => {
      rowItem.forEach((colItem: any) => {
        csvStringRoutine += colItem + ',';
      });
      csvStringRoutine += '\r\n';
    });

    const fileNameRoutine = `clientroutinedata_${formattedDate}.csv`;

    // Create a download link for the CSV file
    csvStringRoutine =
      'data:application/csv,' + encodeURIComponent(csvStringRoutine);
    const linkRoutine = document.createElement('a');
    linkRoutine.setAttribute('href', csvStringRoutine);
    linkRoutine.setAttribute('download', fileNameRoutine);
    document.body.appendChild(linkRoutine);
    linkRoutine.click();

    this.clientArray = [];
  }

  generateLogin(id: string){
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { id: id },
   
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getClients();
    });
  }
}

