 import { SessionMaster } from "./sessionMaster"

export  interface OtSessionData{
  _id: String
  date: Date,
  updatedDate: Date
  session_master_id: SessionMaster,
  sensoryModulation: SensoryModulation,
  proprioceptiveDiscrimination: ProprioceptiveDiscrimination,
  vestibularDiscrimination: VestibularDiscrimination,
  tactileDiscrimination: TactileDiscrimination,
  visual: Visual,
  postural: Postural,
  bilateralIntegration: BilateralIntegration,
  praxis: Praxis,
  grossMotor: GrossMotor,
  fineMotor: FineMotor,
  auditoryAndLanguage: AuditoryAndLanguage,
  adl: Adl,
  emotional: Emotional
}

export interface SensoryModulation{
  threshold: Threshold,
  arousal: Arousal
}
export interface Threshold{
  remarks: String,
  key: String,
  prompt: String
}
export interface Arousal{
  remarks: String,
  key: String,
  prompt: String
}

export interface ProprioceptiveDiscrimination{
  remarks: String,
  key: String,
  prompt: String
}

export interface VestibularDiscrimination{
  remarks: String,
  key: String,
  prompt: String
}

export interface TactileDiscrimination{
  toolManipulation: ToolManipulation,
  visionOccluded: VisionOccluded,
}
export interface ToolManipulation{
  remarks: String,
  key: String,
  prompt: String
}
export interface VisionOccluded{
  remarks: String,
  key: String,
  prompt: String
}


export interface Visual{
  acuity: Acuity,
  eyeStrain: EyeStrain,
  quickLocalisation: QuickLocalisation,
  generalEyeMovements: GeneralEyeMovements,
  dissociation: Dissociation,
  perceptual: Perceptual
}
export interface Acuity{
  remarks: String,
  key: String,
  prompt: String
}
export interface EyeStrain{
  remarks: String,
  key: String,
  prompt: String
}
export interface QuickLocalisation{
  remarks: String,
  key: String,
  prompt: String
}
export interface GeneralEyeMovements{
  remarks: String,
  key: String,
  prompt: String
}
export interface Dissociation{
  remarks: String,
  key: String,
  prompt: String
}
export interface Perceptual{
  remarks: String,
  key: String,
  prompt: String
}


export interface Postural{
  muscleTone: MuscleTone,
  reflex: Reflex,
  endurance: Endurance
  posturalControl: PosturalControl,
  gait: Gait
}
export interface MuscleTone{
  remarks: String,
  key: String,
  prompt: String
}
export interface Reflex{
  remarks: String,
  key: String,
  prompt: String
}
export interface Endurance{
  remarks: String,
  key: String,
  prompt: String
}
export interface PosturalControl{
  remarks: String,
  key: String,
  prompt: String
}
export interface Gait{
  remarks: String,
  key: String,
  prompt: String
}


export interface BilateralIntegration{
  midlineCrossing: MidlineCrossing,
  symmetrical: Symmetrical,
  asymmetrical: Asymmetrical,
  reciprocal: Reciprocal
}
export interface MidlineCrossing{
  remarks: String,
  key: String,
  prompt: String
}
export interface Symmetrical{
  remarks: String,
  key: String,
  prompt: String
}
export interface Asymmetrical{
  remarks: String,
  key: String,
  prompt: String
}
export interface Reciprocal{
  remarks: String,
  key: String,
  prompt: String
}


export interface Praxis{
  ideation: Ideation,
  motorPlanning: MotorPlanning,
  execution: Execution
}
export interface Ideation{
  remarks: String,
  key: String,
  prompt: String
}
export interface MotorPlanning{
  remarks: String,
  key: String,
  prompt: String
}
export interface Execution{
  remarks: String,
  key: String,
  prompt: String
}


export interface GrossMotor{
  remarks: String,
  key: String,
  prompt: String
}


export interface FineMotor{
  strength: Strength,
  grip: Grip,
  isolationWrist: IsolationWrist,
  isolationFingers: IsolationFingers
}
export interface Strength{
  remarks: String,
  key: String,
  prompt: String
}
export interface Grip{
  remarks: String,
  key: String,
  prompt: String
}
export interface IsolationWrist{
  remarks: String,
  key: String,
  prompt: String
}
export interface IsolationFingers{
  remarks: String,
  key: String,
  prompt: String
}

export interface AuditoryAndLanguage{
  articulation: Articulation,
  followingInstructions: FollowingInstructions,
}
export interface Articulation{
  remarks: String,
  key: String,
  prompt: String
}
export interface FollowingInstructions{
  remarks: String,
  key: String,
  prompt: String
}

export interface Adl{
  remarks: String,
  key: String,
  prompt: String
}

export interface Emotional{
  remarks: String,
  key: String,
  prompt: String
}


