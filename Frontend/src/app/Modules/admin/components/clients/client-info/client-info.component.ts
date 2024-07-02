import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Modules/admin/admin.service';
import { MedicalReportViewerComponent } from '../medical-report-viewer/medical-report-viewer.component';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
// import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit,OnDestroy {

  constructor(private adminService:AdminService, private route:ActivatedRoute, public dialog:MatDialog) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe()
  }

  panelOpenState = false;
  panelOpenSchool = false;
  panelOpenRoutine = false;

  infoSubscription: Subscription;
  ngOnInit(): void {
    this.infoSubscription = this.getInfo()
  }

  client :any
  clientName : string
  getInfo(){
    return this.adminService.getClientInfo(this.route.snapshot.paramMap.get('id')).subscribe((client)=>{
      this.client = client
   
      this.clientName = this.client.firstName
    })
  }

  showAge : any;
  ageCalculator(dob){
    const convertAge = new Date(dob);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let age = this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    const months = Math.floor((timeDiff % (1000 * 3600 * 24 * 365)) / (1000 * 3600 * 24 * 30));
    let year = age + 'years and' + months + 'months'
    return year;
  }

  openDialog(path){
    this.dialog.open(MedicalReportViewerComponent,{
      data:{url:path}
    })
  }

  makePdfPersonal(){
    const pdf = document.getElementById('content') as HTMLElement;
    html2canvas(pdf, {}).then(canvas => {
      // Convert canvas into string
      const pdfData = canvas.toDataURL('image/png');

      // Initialize a new PDF document
      const newPdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      // Define the height of each page
      const pageHeightWithMargin = pageHeight - 10; // Adjust margin as needed

      // Calculate the number of pages required based on content height
      const contentHeight = canvas.height;
      const totalPages = Math.ceil(contentHeight / pageHeightWithMargin);

      // Loop through and add content to each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        // Add a new page if it's not the first page
        if (pageNum !== 1) {
          newPdf.addPage();
        }

        // Calculate the vertical offset based on the page number
        const offsetY = -(pageNum - 1) * pageHeightWithMargin;

        // Add the content to the current page
        newPdf.addImage(pdfData, 'PNG', 0, offsetY, pageWidth, contentHeight);

        // If it's not the last page, add a page break
        if (pageNum !== totalPages) {
          newPdf.addPage();
        }
      }

      // Save the PDF with a name
      newPdf.save(this.clientName + "Personal");
    });

  }

  makePdfMedical(){
    const pdfMedical = document.getElementById('contentMedical') as HTMLElement;
    html2canvas(pdfMedical, {}).then(canvas => {
      // Convert canvas into string
      const pdfDataMedical = canvas.toDataURL('image/png');

      // Initialize a new PDF document for medical content
      const newPdfMedical = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const topMargin = 10; // Adjust as needed
      const bottomMargin = 10; // Adjust as needed


      // Define the height of each page
      const pageHeightWithMargin = pageHeight - 10; // Adjust margin as needed

      // Calculate the number of pages required based on medical content height
      const contentHeightMedical = canvas.height/5;

      const totalPagesMedical = Math.floor(contentHeightMedical / pageHeightWithMargin);

      // Calculate the effective content height for each page
      const contentHeightPerPage = pageHeightWithMargin - topMargin - bottomMargin;

      // Loop through and add content to each medical page
      for (let pageNum = 1; pageNum <= totalPagesMedical; pageNum++) {
        // Add a new page if it's not the first page
        if (pageNum !== 1) {
          newPdfMedical.addPage();
        }

        // Calculate the vertical offset based on the page number
        // const offsetY = -(pageNum - 1) * pageHeightWithMargin;
        const offsetY = -(pageNum - 1) * contentHeightPerPage + topMargin;

        // Add the medical content to the current page
        // newPdfMedical.addImage(pdfDataMedical, 'PNG', 0, offsetY, pageWidth, contentHeightMedical);
        newPdfMedical.addImage(pdfDataMedical, 'PNG', 0, offsetY, pageWidth, contentHeightMedical);
      }

      // Save the medical PDF with a name
      newPdfMedical.save(this.clientName + "Medical");
    });
  }

  makePdfSchool(){
    // const pdfSchool = document.getElementById('contentSchool') as HTMLElement;
    // html2canvas(pdfSchool,{}).then(canvas =>{
    //   //convert canvas into string
    //   const pdfDataSchool = canvas.toDataURL('image/png');

    //   //bind the string to pdf
    //   const newPdfSchool = new jsPDF("p","mm","a4");

    //   //add to pdf
    //   const pageWidth = 210;
    //   const pageHeight = 297;

    //   newPdfSchool.addImage(pdfDataSchool, 'PNG', 0, 0, pageWidth, pageHeight)

    //   newPdfSchool.save(this.clientName+"School")
    // })

    const pdfSchool = document.getElementById('contentSchool') as HTMLElement;
    html2canvas(pdfSchool, {}).then(canvas => {
      // Convert canvas into string
      const pdfDataSchool = canvas.toDataURL('image/png');

      // Initialize a new PDF document for school content
      const newPdfSchool = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      // Define the height of each page
      const pageHeightWithMargin = pageHeight - 10; // Adjust margin as needed

      // Calculate the number of pages required based on school content height
      const contentHeightSchool = canvas.height;
      const totalPagesSchool = Math.ceil(contentHeightSchool / pageHeightWithMargin);

      // Loop through and add content to each school page
      for (let pageNum = 1; pageNum <= totalPagesSchool; pageNum++) {
        // Add a new page if it's not the first page
        if (pageNum !== 1) {
          newPdfSchool.addPage();
        }

        // Calculate the vertical offset based on the page number
        const offsetY = -(pageNum - 1) * pageHeightWithMargin;

        // Add the school content to the current page
        newPdfSchool.addImage(pdfDataSchool, 'PNG', 0, offsetY, pageWidth, contentHeightSchool);

        // If it's not the last page, add a page break
        if (pageNum !== totalPagesSchool) {
          newPdfSchool.addPage();
        }
      }

      // Save the school PDF with a name
      newPdfSchool.save(this.clientName + "School");
    });

  }

  makePdfRoutine(){
    const pdfRoutine = document.getElementById('contentDailyRoutine') as HTMLElement;
    html2canvas(pdfRoutine, {}).then(canvas => {
      // Convert canvas into string
      const pdfDataRoutine = canvas.toDataURL('image/png');

      // Initialize a new PDF document for daily routine content
      const newPdfRoutine = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;

      // Define the height of each page
      const pageHeightWithMargin = pageHeight - 10; // Adjust margin as needed

      // Calculate the number of pages required based on routine content height
      const contentHeightRoutine = canvas.height;
      const totalPagesRoutine = Math.ceil(contentHeightRoutine / pageHeightWithMargin);

      // Loop through and add content to each routine page
      for (let pageNum = 1; pageNum <= totalPagesRoutine; pageNum++) {
        // Add a new page if it's not the first page
        if (pageNum !== 1) {
          newPdfRoutine.addPage();
        }

        // Calculate the vertical offset based on the page number
        const offsetY = -(pageNum - 1) * pageHeightWithMargin;

        // Add the routine content to the current page
        newPdfRoutine.addImage(pdfDataRoutine, 'PNG', 0, offsetY, pageWidth, contentHeightRoutine);

        // If it's not the last page, add a page break
        if (pageNum !== totalPagesRoutine) {
          newPdfRoutine.addPage();
        }
      }

      // Save the routine PDF with a name
      newPdfRoutine.save(this.clientName + "Routine");
    });

  }
}
