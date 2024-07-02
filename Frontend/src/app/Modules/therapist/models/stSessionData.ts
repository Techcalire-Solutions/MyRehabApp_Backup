import { SessionMaster } from "./sessionMaster"
import { StSkill } from "./stSkill"

export  interface StSessionData{
  _id: String,
  date: Date,
  updatedDate: Date,
  session_master_id: SessionMaster,
  preLinguistic : PreLinguistic,
  linguistic : Linguistic,
  communication : Communication,
  cognition : Cognition,
  play : Play,
  articulation : Articulation,
  oroMotor : OroMotor,
  fluency : Fluency,
  voice : Voice,
  stData : StData
}


export interface StData{
  skill : StSkill
  grade : String,
  remarks : String
  status : Boolean
  _id: String
}

export interface PreLinguistic{
  joinAttention : String,
  imitation : String,
  remarks : String
}

export interface Linguistic{
  lexicalItems : String,
  advancedConcepts : String,
  syntacticStructures : String,
  pragmaticSkills : String,
  remarks : String
}

export interface Communication{
  functional : String,
  gestrual : String,
  aac : String,
  assistive : String,
  remarks : String
}

export interface Cognition{
  basicSkills : String,
  advancedSkills : String,
  remarks : String
}

export interface Play{
  parallel : String,
  symbolic : String,
  constructive : String,
  pretend : String,
  physical : String,
  exploratory : String,
  sensoryStimulating : String,
  associative : String,
  onlooker : String,
  remarks : String
}

export interface Articulation{
  auditoryDescrimination : String,
  phonology : String,
  placement : String,
  generalization : String,
  wordLevel : String,
  phraseLevel : String,
  remarks : String
}

export interface OroMotor{
  opt : String,
  hypoSensitive : String,
  mixedSensitive : String,
  hyperSensitive : String,
  sucking : String,
  blowing : String,
  chewing : String,
  remarks : String
}

export interface Fluency{
  fluencyShaping : String,
  fluencyModification : String,
  generalization : String,
  maintenance : String,
  remarks : String
}

export interface Voice{
  respiratory : String,
  resonance : String,
  pitch : String,
  loudness : String,
  relaxationExercises : String,
  strengtheningExercises : String,
  remarks : String
}


