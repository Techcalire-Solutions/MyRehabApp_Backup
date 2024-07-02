import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { AdminService } from '../../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../../models/category';
import { User } from '../../../models/user';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogueComponent } from '../../delete-dialogue/delete-dialogue.component';
import { Subscription } from 'rxjs';
import { ViewDocComponent } from '../view-doc/view-doc.component';
import { ViewMoreComponent } from '../view-more/view-more.component';
import { Router } from '@angular/router';
import { Company } from '../../../models/company';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})

export class AddUserComponent implements OnInit, OnDestroy {
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['',[Validators.required,Validators.email]],
    password:['',Validators.required],
    role: ['', Validators.required],
    therapyCategory:[''],
    companyId:[''],
    md:[false],
    qualifications: this.fb.array([]),
    experiences: this.fb.array([]),
    qualification_id : [''],
    qualification_file : [''],
    idProof_id : [''],
    idProof_file : [''],
    experience_id : [''],
    experience_file : [''],
    sharePercentage : [Validators.required],
    birthDate : ['', Validators.required],
    joiningDate : ['', Validators.required]
  });

  qualifications(): FormArray {
    return this.userForm.get("qualifications") as FormArray;
  }

  newQualification(): FormGroup {
    return this.fb.group({
      qualification: ['']
    });
  }

  status: boolean = false;
  addQualification() {
    this.status = true;
    this.qualifications().push(this.newQualification());
  }

  removeQualification(i: number) {
    this.qualifications().removeAt(i);
  }

  experiences(): FormArray {
    return this.userForm.get("experiences") as FormArray;
  }

  newExp(): FormGroup {
    return this.fb.group({
      experience: ['']
    });
  }

  statusExp: boolean = false;
  addExpp() {
    this.statusExp = true;
    this.experiences().push(this.newExp());
  }

  removeExp(i: number) {
    this.experiences().removeAt(i);
  }


  displayedColumnsTherapist : string[] = ['name', 'email', 'therapyCategory', 'sharePercentage', 'viewMore', 'view', 'action']
  displayedColumnsAdmin : string[] = ['name', 'email', 'viewMore', 'view','action']

  roles = [
    {name: 'admin'},
    {name: 'therapist'}
  ]

  companyId: string;
  constructor(private fb: FormBuilder ,private _http:AdminService,private _snackBar: MatSnackBar, public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AddUserComponent>, private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {

    }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe()
    this.therapistSubscription.unsubscribe()
    this.adminSubscription.unsubscribe()
    this.submit?.unsubscribe();
    if(this.tEdit){
      this.tEdit.unsubscribe()
    }
    if(this.aEdit){
      this.aEdit.unsubscribe()
    }
    if(this.delete){
      this.delete.unsubscribe()
    }
    this.companySub?.unsubscribe();
  }

  categorySubscription: Subscription;
  therapistSubscription: Subscription;
  adminSubscription: Subscription;
  addStatus: string;
  therapistStat = false;
  adminStat = false;
  ngOnInit(): void {
    this.categorySubscription = this.getCategory()
    this.getLocalStorage()
    if (this.dialogRef) {
      this.addStatus = this.dialogData?.status;
      if(this.dialogData.role.toLowerCase() === 'therapist') {
        this.therapistStat = true;
      }
      else if(this.dialogData.role.toLowerCase() === 'admin') {
        this.adminStat = true;
      }
    }
  }

  getLocalStorage() {
    let currentUserString = localStorage.getItem('token')
  

    let currentUser = JSON.parse(currentUserString)
    this.companyId = currentUser.company;
 
    this.getCompany()
  }

  categories : Category [] = []
  getCategory(){
    return this._http.getCategory().subscribe((cat)=>{
      this.categories = cat ;
    })
  }

  companySub: Subscription;
  company: Company[] = [];
  companyName: string;
  getCompany(){
    this.companySub = this._http.getCompany().subscribe((company)=>{
      this.company = company;

      this.companyName = company.find(company => company._id === this.companyId).companyName;
      this.therapistSubscription = this.getTherapist()
      this.adminSubscription = this.getAdmin()
    });
  }


  user :any;
  submit: Subscription;
  onSubmit(){
    const companyId = this.userForm.get(['companyId']).value != '' ? this.userForm.get(['companyId']).value : this.companyId;
  

    let data ={
      name: this.userForm.get(['name']).value,
      email: this.userForm.get(['email']).value,
      password: this.userForm.get(['password']).value,
      role: this.userForm.get(['role']).value,
      therapyCategory: this.userForm.get(['therapyCategory']).value,
      md: this.userForm.get(['md']).value,
      qualifications: this.userForm.getRawValue().qualifications,
      experiences: this.userForm.getRawValue().experiences,
      qualification_id : this.userForm.get(['qualification_id']).value,
      qualification_file : this.userForm.get(['qualification_file']).value,
      idProof_id : this.userForm.get(['idProof_id']).value,
      idProof_file : this.userForm.get(['idProof_file']).value,
      experience_id : this.userForm.get(['experience_id']).value,
      experience_file : this.userForm.get(['experience_file']).value,
      sharePercentage : this.userForm.get(['sharePercentage']).value,
      birthDate : this.userForm.get(['birthDate']).value,
      joiningDate : this.userForm.get(['joiningDate']).value,
      companyId : companyId
    }



    this.submit = this._http.addUser(data).subscribe((res)=>{
      this.user = res;
      this._snackBar.open("User added successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
   
      // alert(error)
    }))
  }

  clearControls(){
    this.userForm.reset()
    this.userForm.setErrors(null)
    Object.keys(this.userForm.controls).forEach(key=>{this.userForm.get(key)?.setErrors(null)})
    this.getAdmin()
    this.getTherapist()
    this.getLocalStorage()
    this.router.navigateByUrl('/admin')
  }

  therapist : User[] =[];
  getTherapist(){
    return this._http.getTherapist().subscribe((user)=>{
  
      if(this.companyName.toLowerCase() === 'my rehab app'){
        this.therapist = user
      }else{
        this.therapist = user.filter(u=> u.companyId._id === this.companyId);

      }
      this.filtered = this.therapist
      if (this.therapistStat) {
        // this.addStatus = this.dialogData?.status;
        let id = this.dialogData?.id
        this.editTherapist(id)
      }
    })
  }

  filterValue: any;
  filtered!: any[];
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    if(this.filterValue){
      this.filtered = this.therapist.filter(element =>
      element.name.toLowerCase().includes(filterValue)
      || element.email.toLowerCase().includes(filterValue)
      || element.therapyCategory.abbreviation.toLowerCase().includes(filterValue)
      || element.therapyCategory.therapyName.toLowerCase().includes(filterValue)
    )}

    else{
      this.getTherapist();
    }
  }

  admin : User[] = [];
  getAdmin(){
    return this._http.getAdmin().subscribe((user)=>{
      console.log(user)
      if(this.companyName.toLowerCase() === "my rehab app"){
        this.admin = user
        console.log(this.admin)
      }else{
        this.admin = user.filter(u=> u.companyId._id === this.companyId);
      }

      this.filteredAdmin = this.admin
      console.log(this.filteredAdmin)
      if (this.adminStat) {
        // this.addStatus = this.dialogData?.status;
        let id = this.dialogData?.id
        this.editAdmin(id)
      }
    })
  }

  filterValueAdmin: any;
  filteredAdmin!: any[];
  applyFilterAdmin(event: Event): void {
    const filterValueAdmin = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValueAdmin = filterValueAdmin;
    if(this.filterValueAdmin){
      this.filteredAdmin = this.admin.filter(element =>
      element.name.toLowerCase().includes(filterValueAdmin)
      || element.email.toLowerCase().includes(filterValueAdmin)
    )}

    else{
      this.getAdmin();
    }
  }

  isEdit = false;
  userId : '';
  tEdit: Subscription;
  celebId: string;
  editTherapist(id){
    this.isEdit = true;

    let user = this.therapist.find(x => x._id == id);
    this.celebSub = this._http.getClebrationBuUserId(user._id).subscribe(res =>{
      let celeb = res
      this.celebId = res._id;
      let uName = user.name.toString();
      let uEmail = user.email.toString();
      let uRole = user.role.toString();
      let md : boolean = user.md
      let category = user.therapyCategory._id.toString();
      let qualifications = user.qualifications
      let experiences = user.experiences
      let sharePercentage: any = user.sharePercentage
      let birthDate = celeb.birthDate.toString();
      let joiningDate = celeb.joiningDate.toString();

      this.userForm.patchValue({
        name: uName,
        email: uEmail,
        role: uRole,
        therapyCategory: category,
        md : md,
        experiences: experiences,
        qualifications: qualifications,
        sharePercentage: sharePercentage,
        birthDate: birthDate,
        joiningDate: joiningDate
      })
      this.userId = id
    })
  }

  editTherapistFunction(){
    let data = {
      name : this.userForm.get('name')?.value,
      email : this.userForm.get('email')?.value,
      role : this.userForm.get('role')?.value,
      password : this.userForm.get('password')?.value,
      therapyCategory : this.userForm.get('therapyCategory')?.value,
      md : this.userForm.get('md')?.value,
      sharePercentage : this.userForm.get(['sharePercentage'])?.value,
      qualifications: this.userForm.getRawValue().qualifications,
      experiences: this.userForm.getRawValue().experiences,
      birthDate: this.userForm.get('birthDate')?.value,
      joiningDate: this.userForm.get('joiningDate')?.value,
      companyId: this.userForm.get('companyId')?.value
    }
    this.tEdit = this._http.editUser(data, this.userId, this.celebId).subscribe((res) =>{
      this._snackBar.open("Therapist updated successfully...","" ,{duration:3000})
      // this.dialogRef.close();
      this.clearControls()
    },(error=>{
      alert(error)
    }))
  }

  editAdminStatus = false;
  celebSub: Subscription;
  editAdmin(id){
    this.userId = id

    const qual = this.userForm.get("qualifications") as FormArray;
    const exp = this.userForm.get("experiences") as FormArray;

    this.isEdit = true;
    this.editAdminStatus = true;

    let user = this.admin.find(x => x._id == id);
    this.celebSub = this._http.getClebrationBuUserId(user._id).subscribe(res =>{
      let celeb = res
      this.celebId = res._id;

      let uName = user.name.toString();
      let uEmail = user.email.toString();
      let uRole = user.role.toString();
      let qualifications = user.qualifications
      let experience = user.experiences
      let md = user.md
      let birthDate = celeb.birthDate.toString();
      let joiningDate = celeb.joiningDate.toString();
      let comp = user.companyId._id

      while (qual.length !== 0) {
        qual.removeAt(0);
      }

      qualifications.forEach((qualification: any) => {
        qual.push(this.fb.group(qualification));
      });

      while (exp.length !== 0) {
        exp.removeAt(0);
      }

      experience.forEach((ex: any) => {
        exp.push(this.fb.group(ex));
      });


      this.userForm.patchValue({
        name: uName,
        email: uEmail,
        role: uRole,
        md: md,
        birthDate: birthDate,
        joiningDate: joiningDate,
        companyId: comp
      });
    });
  }

  aEdit: Subscription;
  editAdminFunction(){
    this.isEdit = false;
    if(this.addStatus){
      let data = {
        name : this.userForm.get('name').value,
        email : this.userForm.get('email').value,
        role : this.userForm.get('role').value,
        password : this.userForm.get('password').value,
        qualifications: this.userForm.getRawValue().qualifications,
        experiences: this.userForm.getRawValue().experiences,
        birthDate: this.userForm.get('birthDate').value,
        joiningDate: this.userForm.get('joiningDate').value,
        companyId : this.userForm.get('companyId').value,
        md : this.userForm.get('md').value
      }


      this.aEdit = this._http.editUser(data, this.userId, this.celebId).subscribe((res) =>{
        this.dialogRef.close();
        this._snackBar.open("Admin updated successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{

        alert(error)
      }))
    }else{
      let data = {
        name : this.userForm.get('name').value,
        email : this.userForm.get('email').value,
        role : this.userForm.get('role').value,
        password : this.userForm.get('password').value,
        qualifications: this.userForm.getRawValue().qualifications,
        experiences: this.userForm.getRawValue().experiences,
        birthDate: this.userForm.get('birthDate').value,
        joiningDate: this.userForm.get('joiningDate').value,
        companyId: this.userForm.get('companyId').value,
        md : this.userForm.get('md').value
      }
      this.aEdit = this._http.editUser(data, this.userId, this.celebId).subscribe((res) =>{
        this._snackBar.open("Admin updated successfully...","" ,{duration:3000})
        this.clearControls()
      },(error=>{
      
        alert(error)
      }))
    }
  }

  delete: Subscription;
  deleteUser(id){
    const dialogRef = this.dialog.open(DeleteDialogueComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Perform deletion logic here
        this._http.deleteUser(id).subscribe((user)=>{
          this.getAdmin()
          this.getTherapist()
          this._snackBar.open("User deleted successfully...","" ,{duration:3000})
        },(error=>{
     
          this._snackBar.open(error.error.message,"" ,{duration:3000})
        }))
      }
    })
    this.clearControls()
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  file!: any;
  url!: any;
  uploadStatus = false
  imageUrl!: string;
  onFileSelectedExp(event: any){
    if(event.target.files.length > 0){
      this.uploadStatus= true
      this.file = event.target.files[0]
      let fileType = this.file? this.file.type : '';

      if (this.file) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(this.file);
      }

      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }
      // }
      // else {
      //   window.alert('Please select correct image format');
      // }
    }
  }

  onUploadExp(){
    this.uploadStatus = false
    this._http.uploadUserImage(this.file).subscribe(res=>{
      this.userForm.patchValue({
        experience_id : res.public_id,
        experience_file : res.url
      })
    })
  }

  fileQ!: any;
  urlQ!: any;
  uploadStatusQ = false
  imageUrlQ!: string;
  onFileSelectedQual(event: any){
    if(event.target.files.length > 0){
      this.uploadStatusQ = true
      this.fileQ = event.target.files[0]
      let fileType = this.fileQ? this.fileQ.type : '';

      if (this.fileQ) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrlQ = reader.result as string;
        };
        reader.readAsDataURL(this.fileQ);
      }

      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }
      // }
      // else {
      //   window.alert('Please select correct image format');
      // }
    }
  }

  onUploadQ(){
    this.uploadStatusQ = false
    this._http.uploadQual(this.fileQ).subscribe(res=>{
      this.userForm.patchValue({
        qualification_id : res.public_id,
        qualification_file : res.url,
      })
    })
  }

  fileId!: any;
  urlId!: any;
  uploadStatusId = false
  imageUrlId!: string;
  onFileSelectedId(event: any){
    if(event.target.files.length > 0){
      this.uploadStatusId = true
      this.fileId = event.target.files[0]
      let fileType = this.fileId? this.fileId.type : '';

      if (this.fileId) {
        // You can read the selected file and display it as an image.
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrlId = reader.result as string;
        };
        reader.readAsDataURL(this.fileId);
      }

      // if(fileType.match(/image\/*/)){
      //   let reader = new FileReader();
      //   // reader.readAsDataURL(this.file)
      //   reader.onload = (event: any) =>{
      //     this.url = event.target.result;
      //   }
      // }
      // else {
      //   window.alert('Please select correct image format');
      // }
    }
  }

  onUploadId(){
    this.uploadStatusId = false
    this._http.uploadId(this.fileId).subscribe(res=>{
      this.userForm.patchValue({
        idProof_id : res.public_id,
        idProof_file : res.url,
      })
    })
  }

  viewDocs(path){
    this.dialog.open(ViewDocComponent,{
      data:{url:path}
    })
  }

  viewMore(id: string){
    this.router.navigateByUrl('/admin/adduser/view/' + id)
  }
}
