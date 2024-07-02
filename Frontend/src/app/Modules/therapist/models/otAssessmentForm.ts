import { AssessmentMaster } from './assessmentMaster';
export interface OtAssessment{
  _id : String,
  date: Date,
  updatedDate: Date,
  assessmentMasterId: AssessmentMaster,
  medicalDiagnosis: String,
  generalAppearence: String,
  onObservation: String,
  performanceAreas: PerformanceAreas,
  performanceComponents: PerformanceComponents,
  remarks: String
}

export interface PerformanceAreas{
  dailyLiving: DailyLiving,
  educational: String,
  playAndLeisure: String
}

export interface DailyLiving{
  grooming:String,
  oralHygiene:String,
  bathing:String,
  toiletHygiene:String,
  dressing:String,
  functionalMobility:String,
}

export interface PerformanceComponents{
  sensorymotor: SensoryMotor,
  neuroMuscular: NeuroMuscular,
  motor: Motor,
  handFunction: HandFunction,
  cognitiveFunctioning: CognitiveFunctioning
}

export interface SensoryMotor{
  sensoryIntegration: SensoryIntegration,
  perceptualSkills: PerceptualSkills,
}

export interface SensoryIntegration{
  sensoryAwareness: String,
  sensoryProcessing: String,
  interpretAbility: InterpretAbility
}

export interface InterpretAbility{
  tactile: String,
  propriceptive: String,
  vestibular: String,
  auditory: String,
  visual: String,
  gustatory: String,
  olfactory: String
}

export interface PerceptualSkills{
  stereognosis: String,
  kinesthesia: String,
  bodyScheme: String,
  rlDiscrimination: String,
  formConstancy: String,
  positionSpace: String,
  visualClosure: String,
  groundDiscrimination: String,
  depthPerception: String,
  topographicalOrientation: String
}

export interface NeuroMuscular{
  rom: String,
  muscleTone: String,
  tightness: String,
  contracture: String,
  deformity: String,
  muscleStrength: String,
  endurance: String,
  posturalSitting: String,
  posturalStanding: String,
  gait: String,
  otherFindings: String
}

export interface Motor{
  activityTolerance: String,
  grossMotor: String,
  midlineCrossing: String,
  laterality: String,
  bilateralIntegration: String,
  praxis: String,
  fineMotor: String,
  standingBalance: String,
  oralMotor: String
}

export interface HandFunction{
  reach: Reach,
  grasp: Grasp,
  prehension: Prehension,
  opposition: Opposition,
  release: Release
  preWriting: PreWriting
}

export interface Reach{
  right: String,
  left: String
}

export interface Grasp{
  right: String,
  left: String
}

export interface Prehension{
  right: String,
  left: String
}

export interface Opposition{
  right: String,
  left: String
}

export interface Release{
  right: String,
  left: String
}

export interface PreWriting{
  right: String,
  left: String
}

export interface CognitiveFunctioning{
  cognitiveIntegration: CognitiveIntegration
  cognitiveComponent: CognitiveComponent
}

export interface CognitiveIntegration{
  arousal: string
  initiationActivity: string,
  terminationActivity: string,
  orientationTime: string
  orientationPlace: string
  recognition: string
}

export interface CognitiveComponent{
  attentionSpan: string
  concentrationSpan: string
  stm: string
  ltm: string
  recentMemory: string
  workingMemory: string
  sequencing: string
  categorisation:string
  conceptFormation: string
  problemSolving: string
  generalisationLearning: string
}
