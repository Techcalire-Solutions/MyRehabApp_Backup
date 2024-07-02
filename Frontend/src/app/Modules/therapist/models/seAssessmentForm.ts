
import { AssessmentMaster } from './assessmentMaster';
export interface SeAssessment{
  _id : String,
  date: Date,
  updatedDate: Date,
  assessmentMasterId: AssessmentMaster,
  informant : String,
  strengthChild : String,
  parentalConcern : String,
  fuctionalAreas : FunctionalAreas,
  specificEducationalAreas : SpecificEducationalAreas,
  provisonalDiadnosis : String
  environmentalStreams : String
  environmentalBarriers : String
}

export interface FunctionalAreas{
  learningAndApplying : LearningAndApplying,
  perceptualMotorSkills : PerceptualMotorSkills
  generalTasks : GeneralTasks
  communication : Communication,
  mobility : Mobility
  selfCare : SelfCare
  domesticSelf : DomesticSelf
  interpersonalInteractons :InterpersonalInteractions
  majorLifeAreas : MajorLifeAreas
  communityLife : String,
  functionalAbilities : String,
}

export interface LearningAndApplying{
  watching : String,
  listening : String,
  memory : String,
  attention : String,
  solvingProblem : String,
  socialProblem : String,
  motivationalProblems : String,
  emotionalProblems : String,
}

export interface PerceptualMotorSkills{
  visual : String,
  auditory : String,
  motorCordination : String,
  spatialOrientation : String,
  learningStyle : String,
  handedness : String,
}

export interface GeneralTasks{
  singleTasks : String,
  multipleTasks : String,
}

export interface Communication{
  spokenMessages : String,
  nonVerbalMessages : String,
  speaking : String,
  producingMessage : String,
  conversation : String
}

export interface Mobility{
  lifting : String,
  fineHand : String,
  walkingStairs : String,
  movingAround : String,
  usingTransportation : String,
  driving : String
}

export interface SelfCare{
  washingOneself : String,
  bodyParts : String,
  toiletting : String,
  dressing : String,
  eating : String,
  drinking : String
}

export interface DomesticSelf{
  acquisition : String,
  householdWork : String,
  assisting : String
}

export interface InterpersonalInteractions {
  basic : String,
  withStrangers : String,
  formalRelation : String,
  informalRelation : String,
  familyRelation : String
}
export interface MajorLifeAreas {
  informalEducation : String,
  schoolEducation : String,
  higherEducation : String
}


export interface SpecificEducationalAreas{
  materialsUsed : String,
  objectInteraction : String,
  communicationLanguage : CommunicationLanguage,
  concepts : Concepts,
  seriation : String,
  oneToOne : String,
  reversibility : String,
  specialConcepts : String,
  earlyLiteracy : EarlyLiteracy,
  presentLiteracy : PresentLiteracy,
  testAdministered : String,
  impressions : String,
  observations : String,
  recommendations : String
}
export interface CommunicationLanguage{
  expressive : String,
  receptive : String,
}
export interface Concepts{
  color : String,
  shapes : String,
  size : String,
  quantity : String,
  matching : String,
  similarities : String,
  differences : String,
  classification : String,
}
export interface EarlyLiteracy{
  preReading : PreReading,
  preWriting : PreWriting,
  preMaths : PreMaths
}

export interface PresentLiteracy {
  reading : Reading,
  writing : Writing,
  spelling : Spelling,
  readingComprehension : ReadingComprehension,
  aritmeticComputation : ArithmeticComputation,
  arithmeticReasoning : ArithmeticReasoning
}

export interface PreReading{
  namePicture : String,
  whatTheySee : String,
  handleBook : String,
  alphabets : String,
  sightWords : String,
  letterSound : String
}

export interface PreWriting{
  horizontalStroke : String,
  verticalStroke : String,
  circularScribble : String,
  plusShape : String,
  square : String,
  triangle : String,
  grasp : String,
  capitalAlphabets : String,
  smallAlphabets : String
}

export interface PreMaths{
  roteCount : String,
  recognitionNumeral : String,
  meaningfulCounting : String,
  moreLess : String
}

export interface Reading {
  phoneticAwareness : String,
  fingerTracing : String,
  spellingAloud : String,
  omitsWord : String,
  substituteWord : String,
  ignorePunctuation : String,
  posture : String,
  loudVoice : String,
  distanceBookEye : String,
  reading : String,
  addWord : String,
  mispronounceWord : String,
  pronounceWord : String,
  specify : String
}

export interface Writing {
  leftToRight : String,
  ignoreMargin : String,
  ignoreLine : String,
  overWritting : String,
  posture : String,
  writingStyle : String,
  mixingCapitalSmall : String,
  omits : String,
  spaciningLine : String,
  puctuations : String,
  letterReversal : String,
  wordReversal : String,
  anyOther : String
}

export interface Spelling{
  sightWords : String,
  cvcWords : String,
  blendWords : String,
  consonant : String,
  anyOther : String
}

export interface ReadingComprehension{
  promptAnswers : String,
  repeatedQuestion : String,
  transalatedQuestion : String,
  answerReadingMaterial : String,
  refusesOrRepeats : String,
  anyOther : String
}

export interface ArithmeticComputation{
  rightLeft : String,
  operationalSymbols : String,
  placeValues : String,
  fingerCounting : String,
  drawAddtion : String,
  darwSubtraction : String,
  ignoreAddition : String,
  ignoreSubtraction : String,
  errorMultplication : String,
  errorDivision : String,
  errorTransfer : String,
  substitutions : String,
  errorDecimalPoint : String,
  addition : String,
  subtraction : String,
  multiplication : String,
  division : String,
  anyOther : String
}

export interface ArithmeticReasoning{
  readStorySum : String,
  explainStorySum : String,
  addition : String,
  subtraction : String,
  mutiplication : String,
  division : String,
  anyOther : String
}
