import { validateVerticalPosition } from '@angular/cdk/overlay';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component , ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, Validators ,FormsModule, FormControl} from '@angular/forms';
import { ClientRegistrationService } from '../client-registration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Form } from '@angular/forms';
import { FactoryTarget } from '@angular/compiler';



@Component({
  selector: 'app-client-registration',
  templateUrl: './client-registration.component.html',
  styleUrls: ['./client-registration.component.scss']
})
export class ClientRegistrationComponent {

  ngOnInit(): void {
    this.clientIDGeneration()
  }

  @ViewChild ('stepper') stepperRef: ElementRef

  personalForm = this.fb.group({
    client_ID:[''],
    firstName:['', Validators.required],
    emergencyNumber:['',[Validators.required, Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    email:['',[Validators.email]],
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
    motherMobile:['',[ Validators.pattern("^[0-9 +]*$"),Validators.minLength(10),Validators.maxLength(14)]],
    annualIncome:[''],
    siblingsDetails:[''],
    address1:[''],
    address2:[''], 
    pincode:['',[ Validators.pattern("^()?[0-9]{6}$")]],
    preferredTiming:['']
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
    babyCry: [''],
    feedingProblem: [''],
    sleepProblem: [''],
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
    feedAgeTest: [''],
    goodAppetitie:[''],

    goodAppetitieRadio:[''],
    messyEater:[''],
    messyEaterRadio:[''],
    foodPreference:[''],
    foodPreferenceRadio:[''],
    tasteAndTexture:[''],
    tasteAndTextureRadio:[''],
    ageAppropriate:[''],
    ageAppropriateRadio:[''],
    canDoUpButtons:[''],
    canDoUpButtonsRadio:[''],
    canPutOnSocks:[''],
    canPutOnSocksRadio:[''],
    canPutOnShoes:[''],
    canPutOnShoesRadio:[''],

    toiletTrained:[''],
    toiletRemarks:[''],
    dayAndNight:[''],
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


  constructor(private fb: FormBuilder, private _http:ClientRegistrationService , private snackBar:MatSnackBar) {

  }


  client:any;
  file:File= null;

  hasUnitNumber = false;
  personalformStatus = false;
  saveButton=false;
  nextButton=true;
  medicalformStatus = false;
  schoolformStatus = false;
  DailyRoutineformStatus = false;
  finalButton= false;
  public agreement:boolean = true;
  public saveUsername:boolean;

  public onSaveUsernameChanged(value:boolean){
    this.saveUsername = value;
  }

  genders =[
    {name: 'Male'},
    {name: 'Female'}
  ];

  timing =[
    {time: 'Morning'},
    {time: 'Evening'},
    {time: 'Anytime'}
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
    {name:'Urdu'},
    {name: 'Others'}
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
    {name:'Omani'},
    {name: 'Others'}
  ]

  sleeps=[
    {name:'Continuous'}, 
    {name:'disturbed'}, 
    {name:'takes time to fall asleep'}, 
    {name:'needs rocking carrying stroking etc.'},
    //{name:'Time of Sleep'}
  ];
  
  wakeup=[ 
    {name:'Independent waking up'},
    {name:'Needs to be woken up'},
    //{name:'Time of Waking Up'}
  ];
    
  homework=[
    {name:'Adult supervision'}, 
    {name:'Breaks needed'}, 
    {name:'Frequency of breaks'}, 
    {name:'Needs music'},
    {name:'Continuous verbal prompts'},
    {name:'Any other reinforcers as external supports'}
  ];
  
  difficult=[
    {name:'Parents hugs or calm voice'},
    {name:'Carrying'}, 
    {name:'Rocking, music, calm down corner'}, 
    {name:'A favourite toy or pillow'},
    {name:'Movement breaks'}];

  selections =[
    {name:'Never'},
    {name:'Sometimes'},
    {name:'Usually'},
    {name:'Always'},
    {name:'Unsure'},
  ]

  familyTypes =[
    {name: 'Nuclear'},
    {name: 'Joint'}
  ];

  familyMembers = new FormControl('');
  familyMemberList: string[] = ['Father', 'Mother','Child', 'Sister', 'Brother', 'Grand Father', 'Grand Mother'];


  onSubmit(): void {
    alert('Thanks!');
  }
  client_ID: any;
  ivNum: string = "";
  nextId!: any;
  prefix!: string;


  private clientIDGeneration() {
    this._http.getClients().subscribe((res) => {
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

  onSave() {
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

};

    this._http.saveClient(data).subscribe((res)=>{
      this.client = res;    
      this.personalformStatus = true;

      this.medicalForm.patchValue({
        clientid : this.client._id
      })

      this.schoolForm.patchValue({
        clientid : this.client._id
      })

      this.routineForm.patchValue({
        clientid : this.client._id
      })

      this.saveButton = true;
      this.nextButton=false;
    },(error=>{
      this.snackBar.open(error.error.message,"" ,{duration:3000})
    }))

  }

  onMedicalSubmit(){
    // if(this.uploadStatus){
    //   alert("Selected image is not Uploaded, Please click upload")
    // }
    // else{
      let data={medical:this.medicalForm.getRawValue()}
      this._http.updateMedicalForm(data).subscribe((res)=>{
        this.medicalformStatus = true;
      })
    // }
  }

  updateSchoolForm(){
    let data={school:this.schoolForm.getRawValue()}
    this._http.updateSchoolForm(data).subscribe((res)=>{
      this.schoolformStatus = true;
    })
  }

  updateRoutineForm()
  {
    let data={routine:this.routineForm.getRawValue()}
    this._http.updateRoutinesForm(data).subscribe((res)=>{
      this.DailyRoutineformStatus = true;
      this.resetForms();
   })
  }

  uploadStatus = false
  onFileSelected(event){
    this.uploadStatus= true
    this.file = event.target.files[0]
  }

  onUpload(){
    this.uploadStatus = false
    this._http.uploadImage(this.file).subscribe(res=>{
      this.medicalForm.patchValue({
        cloudinary_id : res.public_id,
        file_url: res.url
      })
    })
  }

  resetForms(){
    this.medicalForm.reset();
    this.personalForm.reset();
    this.routineForm.reset();
    this.schoolForm.reset();
    this.finalButton=true;
    let snabarRef=  this.snackBar.open("Client registration completed successfully ....","", {duration:3000});
    snabarRef.afterDismissed().subscribe(()=>{
    // document.location.href = 'https://www.mindfulkids.co.in/'
    document.location.href = 'http://localhost:4200'
    })    
  }
}







