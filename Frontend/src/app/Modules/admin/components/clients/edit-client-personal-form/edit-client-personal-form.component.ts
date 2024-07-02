import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-client-personal-form',
  templateUrl: './edit-client-personal-form.component.html',
  styleUrls: ['./edit-client-personal-form.component.scss']
})
export class EditClientPersonalFormComponent implements OnInit,OnDestroy {

  constructor(private fb: FormBuilder, private adminService : AdminService, private route : ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.infoSubscription.unsubscribe();
    if(this.submit){
      this.submit.unsubscribe();
    }
  }

  timing =[
    {time: 'Morning'},
    {time: 'Evening'},
    {time: 'Anytime'}
  ];
  personalForm = this.fb.group({
    firstName:[[''], Validators.required],
    client_ID: [],
    emergencyNumber:['',[Validators.required, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    email:[['']],
    dateOfBirth: [[''], Validators.required],
    gender: [[''], Validators.required],
    nationality: [['']],
    homeLanguage: [['']],
    familyType:[['']],
    familyMembers:[''],
    referrerDetails:[''],
    reason:[['']],
    fatherName:[['']],
    fatherOccupation:[['']],
    fatherMobile:['',[, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    motherName:[['']],
    motherOccupation:[['']],
    motherMobile:['',[Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    annualIncome:[''],
    siblingsDetails:[''],
    address1:[['']],
    address2:[''],
    pincode:['',[ Validators.pattern("^()?[0-9]{6}$")]],
    status: [''],
    remarks: [''],
    preferredTiming:['']
  });


  infoSubscription: Subscription;
  ngOnInit(): void {
    this.editInfo()
  }

  genders =[
    {name: 'Male'},
    {name: 'Female'}
  ];

  languages = [
    {name: 'Malayalam'},
    {name: 'English'},
    {name: 'Tamil'},
    {name: 'Hindi'},
    {name:'Assamese'},
    {name: 'Bangla'},
    {name: 'Bodo'},
    {name: 'Dogri'},
    {name:'Gujarati'},
    {name:'Kashmiri'},
    {name:'Kannada'},
    {name:'Konkani'},
    {name:'Maithili'},
    {name:'Manipuri'},
    {name:'Marathi'},
    {name:'Nepali'},
    {name:'Oriya'},
    {name:'Punjabi'},
    {name:'Telugu'},
    {name:'Santali'},
    {name:'Sindhi'},
    {name:'Urdu'}
  ]

  nationalities =[
    {name:'Indian'},
    {name:'Australian'},
    {name:'American'},
    {name:'Bangladeshi'},
    {name:'Canadain'},
    {name:'Chinese'},
    {name:'French'},
    {name:'German'},
    {name:'Kuwaiti'},
    {name:'Nepalese'},
    {name:'Pakisthani'},
    {name:'United Arab Emirates'},
    {name:'Saudi'},
    {name:'Omani'}
  ]

  familyTypes =[
    {name: 'Nuclear'},
    {name: 'Joint'}
  ];

  familyMembers = new FormControl('');
  familyMemberList: string[] = ['Father', 'Mother','Child', 'Sister', 'Brother', 'Grand Father', 'Grand Mother'];

  id : any;
  editInfo(){
    this.infoSubscription = this.adminService.getClientInfo(this.route.snapshot.paramMap.get('id')).subscribe((client)=>{
      this.client = client
      console.log(this.client)
      let firstNameEdit = this.client.firstName
      let client_ID = this.client.client_ID
      let emergencyNumberEdit = this.client.emergencyNumber
      let emailEdit = this.client.email
      let dateOfBirthEdit = this.client.dateOfBirth
      let genderEdit = this.client.gender
      let nationalityEdit = this.client.nationality
      let homeLanguageEdit = this.client.homeLanguage
      let familyTypeEdit = this.client.familyType
      let familyMembersEdit = this.client.familyMembers
      let referrerDetailsEdit = this.client.referrerDetails
      let reasonEdit = this.client.reason
      let fatherNameEdit = this.client.fatherName
      let fatherMobileEdit = this.client.fatherMobile
      let fatherOccupationEdit = this.client.fatherOccupation
      let motherNameEdit = this.client.motherName
      let motherMobileEdit = this.client.motherMobile
      let motherOccupationEdit = this.client.motherOccupation
      let annualIncomeEdit = this.client.annualIncome
      let siblingsDetailsEdit = this.client.siblingsDetails
      let address1Edit = this.client.address1
      let address2Edit = this.client.address2
      let pincodeEdit = this.client.pincode
      let statusEdit = this.client.status
      let remarksEdit = this.client.remarks

      this.personalForm.patchValue({
        client_ID : client_ID,
        firstName : firstNameEdit,
        emergencyNumber : emergencyNumberEdit,
        email : emailEdit,
        dateOfBirth : dateOfBirthEdit,
        gender : genderEdit,
      nationality : nationalityEdit,
        homeLanguage : homeLanguageEdit,
        familyType : familyTypeEdit,
        familyMembers : familyMembersEdit,
        referrerDetails : referrerDetailsEdit,
        reason : reasonEdit,
        fatherName : fatherNameEdit,
        fatherMobile : fatherMobileEdit,
        fatherOccupation : fatherOccupationEdit,
        motherName : motherNameEdit,
        motherMobile : motherMobileEdit,
        motherOccupation : motherOccupationEdit,
        annualIncome : annualIncomeEdit,
        siblingsDetails : siblingsDetailsEdit,
        address1 : address1Edit,
        address2 : address2Edit,
        pincode : pincodeEdit,
        status : statusEdit,
        remarks : remarksEdit
      })
    })
  }

  client :any
  submit: Subscription;
  onSubmit(){
    let data ={
      firstName : this.personalForm.get('firstName').value,
      client_ID: this.personalForm.get('client_ID').value,
      emergencyNumber : this.personalForm.get('emergencyNumber').value,
      email : this.personalForm.get('email').value,
      dateOfBirth : this.personalForm.get('dateOfBirth').value,
      gender : this.personalForm.get('gender').value,
      nationality : this.personalForm.get('nationality').value,
      homeLanguage : this.personalForm.get('homeLanguage').value,
      familyType : this.personalForm.get('familyType').value,
      familyMembers : this.personalForm.get('familyMembers').value,
      referrerDetails : this.personalForm.get('referrerDetails').value,
      reason : this.personalForm.get('reason').value,
      fatherName : this.personalForm.get('fatherName').value,
      fatherMobile : this.personalForm.get('fatherMobile').value,
      fatherOccupation : this.personalForm.get('fatherOccupation').value,
      motherName : this.personalForm.get('motherName').value,
      motherMobile : this.personalForm.get('motherMobile').value,
      motherOccupation : this.personalForm.get('motherOccupation').value,
      annualIncome : this.personalForm.get('annualIncome').value,
      siblingsDetails : this.personalForm.get('siblingsDetails').value,
      address1 : this.personalForm.get('address1').value,
      address2 : this.personalForm.get('address2').value,
      pincode : this.personalForm.get('pincode').value,
      status : this.personalForm.get('status').value,
      remarks : this.personalForm.get('remarks').value
    }
    this.submit = this.adminService.editPersonalForm(data, this.route.snapshot.params['id']).subscribe((data)=>{
      history.back();
      this._snackBar.open("Updated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
          alert(error)
        }))
  }

  clearControls(){
    this.personalForm.reset()
  }
}
