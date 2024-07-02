import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../admin.service';
import { Client } from '../../../models/client';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  ngOnDestroy(){
    if(this.submit){
      this.submit.unsubscribe();
    }
    if(this.medicalSub){
      this.medicalSub.unsubscribe();
    }
    if(this.schoolSub){
      this.schoolSub.unsubscribe();
    }
    if(this.routineSub){
      this.routineSub.unsubscribe();
    }
  }

  constructor(private fb: FormBuilder, private adminService : AdminService, private _snackBar: MatSnackBar,
    private router:Router) { }

  personalForm = this.fb.group({
    client_ID : [''],
    firstName:['', Validators.required],
    emergencyNumber:['',[Validators.required, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    email:['',[,Validators.email]],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    nationality: [''],
    homeLanguage: [''],
    familyType:[''],
    familyMembers:[''],
    referrerDetails:[''],
    reason:[''],
    fatherName:[''],
    fatherOccupation:[''],
    fatherMobile:['',[ Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    motherName:[''],
    motherOccupation:[''],
    motherMobile:['',[Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    annualIncome:[''],
    siblingsDetails:[''],
    address1:[''],
    address2:[''],
    pincode:['',[ Validators.pattern("^()?[0-9]{6}$")]],
    preferredTiming:[''],
    remarks: ['']
  });

  medicalForm = this.fb.group({
    clientid : '',
    pregnancy: [''],
    typeOfDelivery: [''],
    alcohol: [false],
    smoking: [false],
    medications : [''],
    pregnancyComplications: [''],
    pregnancyType : [''],
    prematureMonths: [''],
    babyCry: [false],
    feedingProblem: [false],
    sleepProblem: [false],
    birthWeight: [''],
    birthCompilcation: [''],
    importantIllness : [''],
    medicalCondition : [''],
    consanguineousMarriageHistory : [''],
    history : [''],
    remarksVision : [''],
    eyeTest : [false],
    useGlass : [false],
    eyeProblem : [false],
    hearingTest : [false],
    remarksHearing : [''],
    hearingAid : [false],
    earProblem : [false],
    investigationConducted : [''],
    currentMedication : [''],
    previoustMedication : [''],
    allergies : [''],
    actualTherapies : [''],
    previousTherapies : [''],
    headRaise : [''],
    rollOver : [''],
    independentSitting : [''],
    crawled : [''],
    pulledToStand : [''],
    independentStanding :[''],
    walking : [''],
    spoon : [''],
    babbling : [''],
    saidFirstWords : [''],
    presentLanguage : [''],
    fingerFeeding:[''],
    dress:[''],
    cloudinary_id:'',
    file_url:''
  });

  schoolForm = this.fb.group({
    clientid : '',
    schoolNameAndAddress:[''],
    grade:[''],
    teacherNameDetails:[''],
    previousSchool:[''],
    generalBehaviour:[''],
    teacherNoted:[''],
    getAlongWithOthers:[''],
    mainSupport:[''],
    screenTime:[''],
    playInterest:['']
  });

  routineForm = this.fb.group({
    clientid :'',
    feedAge:[''],
    goodAppetitie:[''],
    messyEater:[''],
    foodPreference:[''],
    tasteAndTexture:[''],
    ageAppropriate:[''],
    canDoUpButtons:[''],
    canPutOnSocks:[''],
    canPutOnShoes:[''],
    toiletTrained:[''],
    dayAndNight:[''],
    toiletRemarks:[''],
    toiletNight:[''],
    accidents:[''],
    toiletPaperUse:[''],
    managingClothing:[''],
    washingHands:[''],
    bathingAndBrushing:[''],
    typicalNightSleep:[''],
    timeOfSleep:[''],
    remarksSleep:[''],
    typicalWakeup:[''],
    timeOfWakeup:[''],
    remarksWakeUp:[''],
    homework:[''],
    remarksHomework:[''],
    routineStrategies:[''],
    difficultSituation:[''],
    remarksChildBehaviour :[''],
    howYouKnowAboutUs:[''],
    agreement:false
  });


  ngOnInit(): void {
    this.clientIDGeneration()
  }

  timing =[
    {time: 'Morning'},
    {time: 'Evening'},
    {time: 'Anytime'}
  ];

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

  client :any
  submit: Subscription;
  onSubmit(){
    // Assuming this is your client form
const formData = this.personalForm.getRawValue();

// Define the data object
const data = {

  // Add fields specific to client form below
  client_ID: this.client_ID,
  firstName: formData.firstName,
  emergencyNumber: formData.emergencyNumber,
  email: formData.email,
  dateOfBirth: formData.dateOfBirth,
  gender: formData.gender,
  nationality: formData.nationality,
  homeLanguage: formData.homeLanguage,
  familyType: formData.familyType,
  familyMembers: formData.familyMembers,
  referrerDetails: formData.referrerDetails,
  reason: formData.reason,
  fatherName: formData.fatherName,
  fatherOccupation: formData.fatherOccupation,
  fatherMobile: formData.fatherMobile,
  motherName: formData.motherName,
  motherOccupation: formData.motherOccupation,
  motherMobile: formData.motherMobile,
  annualIncome: formData.annualIncome,
  siblingsDetails: formData.siblingsDetails,
  address1: formData.address1,
  address2: formData.address2,
  pincode: formData.pincode,
  preferredTiming: formData.preferredTiming,
  remarks: formData.remarks
};


   this.submit = this.adminService.saveClient(data).subscribe((res)=>{

      this.client = res;

      this.medicalForm.patchValue({
        clientid : this.client._id
      })

      this.schoolForm.patchValue({
        clientid : this.client._id
      })

      this.routineForm.patchValue({
        clientid : this.client._id
      })

      this.onMedicalSubmit();
      this.updateRoutineForm();
      this.updateSchoolForm();

      this._snackBar.open("Client added successfully...","" ,{duration:3000})
      this.router.navigateByUrl('/admin/viewclients')
      this.clearControls()
  }, (error=>{
    console.log(error)
    this._snackBar.open(error.error.message,"" ,{duration:3000})
    }));
  }

  clearControls(){
    this.personalForm.reset()
  }

  medicalSub: Subscription;
  onMedicalSubmit(){
    let data={medical:this.medicalForm.getRawValue()}
    this.medicalSub = this.adminService.updateMedicalForm(data).subscribe((res)=>{})
  }

  schoolSub: Subscription;
  updateSchoolForm(){
    let data={school:this.schoolForm.getRawValue()}
    this.schoolSub = this.adminService.updateSchoolForm(data).subscribe((res)=>{})
  }

  routineSub: Subscription;
  updateRoutineForm(){
    let data={routine:this.routineForm.getRawValue()}
    this.routineSub = this.adminService.updateRoutinesForm(data).subscribe((res)=>{})
  }

  client_ID: any;
  ivNum: string = "";
  nextId!: any;
  prefix!: string;

  private clientIDGeneration() {
    this.adminService.getClients().subscribe((res) => {
      if (res.length > 0) {
        const maxId = res.reduce(
          (prevMax: number, inv: { client_ID: string }) => {
            // Check if inv.poNumber is not null or undefined
            const matches = inv.client_ID ? inv.client_ID.match(/\d+$/) : null;
            const idNumber = matches ? parseInt(matches[0], 10) : 0;
  
            this.prefix = this.extractLetters(inv.client_ID);
  
            if (!isNaN(idNumber)) {
              return idNumber > prevMax ? idNumber : prevMax;
            } else {
              return prevMax;
            }
          },
          0
        );
  
        this.nextId = maxId + 1;
      } else {
        this.nextId = 100; // Start with 100 instead of 1
        this.prefix = "CDC"; // Set prefix to "CDC" when there are no clients
      }
  
      // Ensure nextId is not already used
      while (res.some((client) => client.client_ID === `${this.prefix}${this.nextId.toString().padStart(3, "0")}`)) {
        this.nextId++;
      }
  
      // Simplified calculation of paddedId
      const paddedId = `${this.prefix}${this.nextId.toString().padStart(3, "0")}`;
  
      // Set ivNum and poNumber
      this.ivNum = paddedId;
      this.personalForm.get("client_ID")?.setValue(this.ivNum);
      this.client_ID = this.ivNum;
  
      // Uncomment the line below if needed
      // this.poForm.get("poNumber")?.setValue(this.ivNum);
    });
  }
  
  
  
  
  private extractLetters(client_ID: string | null | undefined): string {
    // Check if poNumber is null or undefined, and return an empty string in that case
    if (client_ID == null) {
      return "";
    }
  
    // Use a regular expression to extract letters
    const lettersMatch = client_ID.match(/^[a-zA-Z]+/);
  
    // Check if there is a match, and return the first match (letters) or "PO" if no letters are found
    return lettersMatch ? lettersMatch[0] : "CDC";
  }
  
}
