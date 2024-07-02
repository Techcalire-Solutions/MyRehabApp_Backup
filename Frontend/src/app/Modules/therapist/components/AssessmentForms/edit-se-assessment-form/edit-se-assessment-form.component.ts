import { SeAssessment } from '../../../models/seAssessmentForm';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TherapistService } from '../../../therapist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-se-assessment-form',
  templateUrl: './edit-se-assessment-form.component.html',
  styleUrls: ['./edit-se-assessment-form.component.scss']
})
export class EditSeAssessmentFormComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder ,private therapistService:TherapistService,private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.seSubscription.unsubscribe()
    if(this.submitS){
      this.submitS.unsubscribe();
    }
  }


  seAssessmentForm = this.fb.group({
    assessmentMasterId: this.activatedRoute.snapshot.params['id'],
    informant : [''],
    strengthChild : [''],
    parentalConcern : [''],
    fuctionalAreas : this.fb.group({
      learningAndApplying : this.fb.group({
        watching : [''],
        listening : [''],
        memory : [''],
        attention : [''],
        solvingProblem : [''],
        socialProblem : [''],
        motivationalProblems : [''],
        emotionalProblems : [''],
      }),
      perceptualMotorSkills : this.fb.group({
        visual : [''],
        auditory : [''],
        motorCordination : [''],
        spatialOrientation : [''],
        learningStyle : [''],
        handedness : [''],
      }),
      generalTasks : this.fb.group({
        singleTasks : [''],
        multipleTasks : [''],
      }),
      communication : this.fb.group({
        spokenMessages : [''],
        nonVerbalMessages : [''],
        speaking : [''],
        producingMessage : [''],
        conversation : ['']
      }),
      mobility : this.fb.group({
        lifting : [''],
        fineHand : [''],
        walkingStairs : [''],
        movingAround : [''],
        usingTransportation : [''],
        driving : ['']
      }),
      selfCare : this.fb.group({
        washingOneself : [''],
        bodyParts : [''],
        toiletting : [''],
        dressing : [''],
        eating : [''],
        drinking : ['']
      }),
      domesticSelf : this.fb.group({
        acquisition : [''],
        householdWork : [''],
        assisting : ['']
      }),
      interpersonalInteractons :this.fb.group({
        basic : [''],
        withStrangers : [''],
        formalRelation : [''],
        informalRelation : [''],
        familyRelation : ['']
      }),
      majorLifeAreas : this.fb.group({
        informalEducation : [''],
        schoolEducation : [''],
        higherEducation : ['']
      }),
      communityLife : [''],
      functionalAbilities : [''],
    }),

    specificEducationalAreas : this.fb.group({
      materialsUsed : [''],
      objectInteraction : [''],
      communicationLanguage : this.fb.group({
        expressive : [''],
        receptive : [''],
      }),
      concepts : this.fb.group({
        color : [''],
        shapes : [''],
        size : [''],
        quantity : [''],
        matching : [''],
        similarities : [''],
        differences : [''],
        classification : [''],
      }),
      seriation : [''],
      oneToOne : [''],
      reversibility : [''],
      specialConcepts : [''],
      earlyLiteracy : this.fb.group({
        preReading : this.fb.group({
          namePicture : [''],
          whatTheySee : [''],
          handleBook : [''],
          alphabets : [''],
          sightWords : [''],
          letterSound : ['']
        }),
        preWriting : this.fb.group({
          horizontalStroke : [''],
          verticalStroke : [''],
          circularScribble : [''],
          plusShape : [''],
          square : [''],
          triangle : [''],
          grasp : [''],
          capitalAlphabets : [''],
          smallAlphabets : ['']
        }),
        preMaths : this.fb.group({
          roteCount : [''],
          recognitionNumeral : [''],
          meaningfulCounting : [''],
          moreLess : ['']
        })
      }),
      presentLiteracy : this.fb.group({
        reading : this.fb.group({
          phoneticAwareness : [''],
          fingerTracing : [''],
          spellingAloud : [''],
          omitsWord : [''],
          substituteWord : [''],
          ignorePunctuation : [''],
          posture : [''],
          loudVoice : [''],
          distanceBookEye : [''],
          reading : [''],
          addWord : [''],
          mispronounceWord : [''],
          pronounceWord : [''],
          specify : ['']
        }),
        writing : this.fb.group({
          leftToRight : [''],
          ignoreMargin : [''],
          ignoreLine : [''],
          overWritting : [''],
          posture : [''],
          writingStyle : [''],
          mixingCapitalSmall : [''],
          omits : [''],
          spaciningLine : [''],
          puctuations : [''],
          letterReversal : [''],
          wordReversal : [''],
          anyOther : ['']
        }),
        spelling : this.fb.group({
          sightWords : [''],
          cvcWords : [''],
          blendWords : [''],
          consonant : [''],
          anyOther : ['']
        }),
        readingComprehension : this.fb.group({
          promptAnswers : [''],
          repeatedQuestion : [''],
          transalatedQuestion : [''],
          answerReadingMaterial : [''],
          refusesOrRepeats : [''],
          anyOther : ['']
        }),
        aritmeticComputation : this.fb.group({
          rightLeft : [''],
          operationalSymbols : [''],
          placeValues : [''],
          fingerCounting : [''],
          drawAddtion : [''],
          darwSubtraction : [''],
          ignoreAddition : [''],
          ignoreSubtraction : [''],
          errorMultplication : [''],
          errorDivision : [''],
          errorTransfer : [''],
          substitutions : [''],
          errorDecimalPoint : [''],
          addition : [''],
          subtraction : [''],
          multiplication : [''],
          division : [''],
          anyOther : ['']
        }),
        arithmeticReasoning : this.fb.group({
          readStorySum : [''],
          explainStorySum : [''],
          addition : [''],
          subtraction : [''],
          mutiplication : [''],
          division : [''],
          anyOther : ['']
        })
      }),
      testAdministered : [''],
      impressions : [''],
      observations : [''],
      recommendations : ['']
    }),
    provisonalDiadnosis : [''],
    environmentalStreams : [''],
    environmentalBarriers : ['']
  })

  seSubscription: Subscription;
  ngOnInit(): void {
    this.seSubscription = this.editSeAssessment()
  }

  seData : SeAssessment;
  id : any;
  editSeAssessment(){
    return this.therapistService.getSeAssessmentId(this.activatedRoute.snapshot.params['id']).subscribe((se)=>{
      this.seData = se
      this.id = this.seData._id

      let informant = this.seData.informant.toString()
      let strengthChild = this.seData.strengthChild.toString()
      let parentalConcern = this.seData.parentalConcern.toString()

      let watching = this.seData.fuctionalAreas.learningAndApplying.watching.toString()
      let listening = this.seData.fuctionalAreas.learningAndApplying.listening.toString()
      let memory = this.seData.fuctionalAreas.learningAndApplying.memory.toString()
      let attention = this.seData.fuctionalAreas.learningAndApplying.attention.toString()
      let solvingProblem = this.seData.fuctionalAreas.learningAndApplying.solvingProblem.toString()
      let socialProblem = this.seData.fuctionalAreas.learningAndApplying.socialProblem.toString()
      let motivationalProblems = this.seData.fuctionalAreas.learningAndApplying.motivationalProblems.toString()
      let emotionalProblems = this.seData.fuctionalAreas.learningAndApplying.emotionalProblems.toString()

      let visual = this.seData.fuctionalAreas.perceptualMotorSkills.visual.toString()
      let auditory = this.seData.fuctionalAreas.perceptualMotorSkills.auditory.toString()
      let motorCordination = this.seData.fuctionalAreas.perceptualMotorSkills.motorCordination.toString()
      let spatialOrientation = this.seData.fuctionalAreas.perceptualMotorSkills.spatialOrientation.toString()
      let learningStyle = this.seData.fuctionalAreas.perceptualMotorSkills.learningStyle.toString()
      let handedness = this.seData.fuctionalAreas.perceptualMotorSkills.handedness.toString()

      let singleTasks = this.seData.fuctionalAreas.generalTasks.singleTasks.toString()
      let multipleTasks = this.seData.fuctionalAreas.generalTasks.multipleTasks.toString()

      let spokenMessages = this.seData.fuctionalAreas.communication.spokenMessages.toString()
      let nonVerbalMessages = this.seData.fuctionalAreas.communication.nonVerbalMessages.toString()
      let speaking = this.seData.fuctionalAreas.communication.speaking.toString()
      let producingMessage = this.seData.fuctionalAreas.communication.producingMessage.toString()
      let conversation = this.seData.fuctionalAreas.communication.conversation.toString()

      let lifting = this.seData.fuctionalAreas.mobility.lifting.toString()
      let fineHand = this.seData.fuctionalAreas.mobility.fineHand.toString()
      let walkingStairs = this.seData.fuctionalAreas.mobility.walkingStairs.toString()
      let movingAround = this.seData.fuctionalAreas.mobility.movingAround.toString()
      let usingTransportation = this.seData.fuctionalAreas.mobility.usingTransportation.toString()
      let driving = this.seData.fuctionalAreas.mobility.driving.toString()

      let washingOneself = this.seData.fuctionalAreas.selfCare.washingOneself.toString()
      let bodyParts = this.seData.fuctionalAreas.selfCare.bodyParts.toString()
      let toiletting = this.seData.fuctionalAreas.selfCare.toiletting.toString()
      let dressing = this.seData.fuctionalAreas.selfCare.dressing.toString()
      let eating = this.seData.fuctionalAreas.selfCare.eating.toString()
      let drinking = this.seData.fuctionalAreas.selfCare.drinking.toString()

      let acquisition = this.seData.fuctionalAreas.domesticSelf.acquisition.toString()
      let householdWork = this.seData.fuctionalAreas.domesticSelf.householdWork.toString()
      let assisting = this.seData.fuctionalAreas.domesticSelf.assisting.toString()

      let basic = this.seData.fuctionalAreas.interpersonalInteractons.basic.toString()
      let withStrangers = this.seData.fuctionalAreas.interpersonalInteractons.withStrangers.toString()
      let formalRelation = this.seData.fuctionalAreas.interpersonalInteractons.formalRelation.toString()
      let informalRelation = this.seData.fuctionalAreas.interpersonalInteractons.informalRelation.toString()
      let familyRelation = this.seData.fuctionalAreas.interpersonalInteractons.familyRelation.toString()

      let informalEducation = this.seData.fuctionalAreas.majorLifeAreas.informalEducation.toString()
      let schoolEducation = this.seData.fuctionalAreas.majorLifeAreas.schoolEducation.toString()
      let higherEducation = this.seData.fuctionalAreas.majorLifeAreas.higherEducation.toString()

      let communityLife = this.seData.fuctionalAreas.communityLife.toString()
      let functionalAbilities = this.seData.fuctionalAreas.functionalAbilities.toString()

      let materialsUsed = this.seData.specificEducationalAreas.materialsUsed.toString()
      let objectInteraction = this.seData.specificEducationalAreas.objectInteraction.toString()

      let expressive = this.seData.specificEducationalAreas.communicationLanguage.expressive.toString()
      let receptive = this.seData.specificEducationalAreas.communicationLanguage.receptive.toString()

      let color = this.seData.specificEducationalAreas.concepts.color.toString()
      let shapes = this.seData.specificEducationalAreas.concepts.shapes.toString()
      let size = this.seData.specificEducationalAreas.concepts.size.toString()
      let quantity = this.seData.specificEducationalAreas.concepts.quantity.toString()
      let matching = this.seData.specificEducationalAreas.concepts.matching.toString()
      let similarities = this.seData.specificEducationalAreas.concepts.similarities.toString()
      let differences = this.seData.specificEducationalAreas.concepts.differences.toString()
      let classification = this.seData.specificEducationalAreas.concepts.classification.toString()

      let seriation = this.seData.specificEducationalAreas.seriation.toString()
      let oneToOne = this.seData.specificEducationalAreas.oneToOne.toString()
      let reversibility = this.seData.specificEducationalAreas.reversibility.toString()
      let specialConcepts = this.seData.specificEducationalAreas.specialConcepts.toString()

      let namePicture = this.seData.specificEducationalAreas.earlyLiteracy.preReading.namePicture.toString()
      let whatTheySee = this.seData.specificEducationalAreas.earlyLiteracy.preReading.whatTheySee.toString()
      let handleBook = this.seData.specificEducationalAreas.earlyLiteracy.preReading.handleBook.toString()
      let alphabets = this.seData.specificEducationalAreas.earlyLiteracy.preReading.alphabets.toString()
      let sightWords = this.seData.specificEducationalAreas.earlyLiteracy.preReading.sightWords.toString()
      let letterSound = this.seData.specificEducationalAreas.earlyLiteracy.preReading.letterSound.toString()

      let horizontalStroke = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.horizontalStroke.toString()
      let verticalStroke = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.verticalStroke.toString()
      let circularScribble = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.circularScribble.toString()
      let plusShape = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.plusShape.toString()
      let square = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.square.toString()
      let triangle = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.triangle.toString()
      let grasp = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.grasp.toString()
      let capitalAlphabets = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.capitalAlphabets.toString()
      let smallAlphabets = this.seData.specificEducationalAreas.earlyLiteracy.preWriting.smallAlphabets.toString()

      let roteCount = this.seData.specificEducationalAreas.earlyLiteracy.preMaths.roteCount.toString()
      let recognitionNumeral = this.seData.specificEducationalAreas.earlyLiteracy.preMaths.recognitionNumeral.toString()
      let meaningfulCounting = this.seData.specificEducationalAreas.earlyLiteracy.preMaths.meaningfulCounting.toString()
      let moreLess = this.seData.specificEducationalAreas.earlyLiteracy.preMaths.moreLess.toString()

      let phoneticAwareness = this.seData.specificEducationalAreas.presentLiteracy.reading.phoneticAwareness.toString()
      let fingerTracing = this.seData.specificEducationalAreas.presentLiteracy.reading.fingerTracing.toString()
      let spellingAloud = this.seData.specificEducationalAreas.presentLiteracy.reading.spellingAloud.toString()
      let omitsWord = this.seData.specificEducationalAreas.presentLiteracy.reading.omitsWord.toString()
      let substituteWord = this.seData.specificEducationalAreas.presentLiteracy.reading.substituteWord.toString()
      let ignorePunctuation = this.seData.specificEducationalAreas.presentLiteracy.reading.ignorePunctuation.toString()
      let posture = this.seData.specificEducationalAreas.presentLiteracy.reading.posture.toString()
      let loudVoice = this.seData.specificEducationalAreas.presentLiteracy.reading.loudVoice.toString()
      let distanceBookEye = this.seData.specificEducationalAreas.presentLiteracy.reading.distanceBookEye.toString()
      let reading = this.seData.specificEducationalAreas.presentLiteracy.reading.reading.toString()
      let addWord = this.seData.specificEducationalAreas.presentLiteracy.reading.addWord.toString()
      let mispronounceWord = this.seData.specificEducationalAreas.presentLiteracy.reading.mispronounceWord.toString()
      let pronounceWord = this.seData.specificEducationalAreas.presentLiteracy.reading.pronounceWord.toString()
      let specify = this.seData.specificEducationalAreas.presentLiteracy.reading.specify.toString()

      let leftToRight = this.seData.specificEducationalAreas.presentLiteracy.writing.leftToRight.toString()
      let ignoreMargin = this.seData.specificEducationalAreas.presentLiteracy.writing.ignoreMargin.toString()
      let ignoreLine = this.seData.specificEducationalAreas.presentLiteracy.writing.ignoreLine.toString()
      let overWritting = this.seData.specificEducationalAreas.presentLiteracy.writing.overWritting.toString()
      let postureWriting = this.seData.specificEducationalAreas.presentLiteracy.writing.posture.toString()
      let writingStyle = this.seData.specificEducationalAreas.presentLiteracy.writing.writingStyle.toString()
      let mixingCapitalSmall = this.seData.specificEducationalAreas.presentLiteracy.writing.mixingCapitalSmall.toString()
      let omits = this.seData.specificEducationalAreas.presentLiteracy.writing.omits.toString()
      let spaciningLine = this.seData.specificEducationalAreas.presentLiteracy.writing.spaciningLine.toString()
      let puctuations = this.seData.specificEducationalAreas.presentLiteracy.writing.puctuations.toString()
      let letterReversal = this.seData.specificEducationalAreas.presentLiteracy.writing.letterReversal.toString()
      let wordReversal = this.seData.specificEducationalAreas.presentLiteracy.writing.wordReversal.toString()
      let anyOther = this.seData.specificEducationalAreas.presentLiteracy.writing.anyOther.toString()

      let sightWordsSpelling = this.seData.specificEducationalAreas.presentLiteracy.spelling.sightWords.toString()
      let cvcWords = this.seData.specificEducationalAreas.presentLiteracy.spelling.cvcWords.toString()
      let blendWords = this.seData.specificEducationalAreas.presentLiteracy.spelling.blendWords.toString()
      let consonant = this.seData.specificEducationalAreas.presentLiteracy.spelling.consonant.toString()
      let anyOtherSpelling = this.seData.specificEducationalAreas.presentLiteracy.spelling.anyOther.toString()

      let promptAnswers = this.seData.specificEducationalAreas.presentLiteracy.readingComprehension.promptAnswers.toString()
      let repeatedQuestion = this.seData.specificEducationalAreas.presentLiteracy.readingComprehension.repeatedQuestion.toString()
      let transalatedQuestion = this.seData.specificEducationalAreas.presentLiteracy.readingComprehension.transalatedQuestion.toString()
      let answerReadingMaterial = this.seData.specificEducationalAreas.presentLiteracy.readingComprehension.answerReadingMaterial.toString()
      let refusesOrRepeats = this.seData.specificEducationalAreas.presentLiteracy.readingComprehension.refusesOrRepeats.toString()
      let anyOtherComprehension = this.seData.specificEducationalAreas.presentLiteracy.readingComprehension.anyOther.toString()

      let rightLeft = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.rightLeft.toString()
      let operationalSymbols = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.operationalSymbols.toString()
      let placeValues = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.placeValues.toString()
      let fingerCounting = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.fingerCounting.toString()
      let drawAddtion = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.drawAddtion.toString()
      let darwSubtraction = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.darwSubtraction.toString()
      let ignoreAddition = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.ignoreAddition.toString()
      let ignoreSubtraction = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.ignoreSubtraction.toString()
      let errorMultplication = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.errorMultplication.toString()
      let errorDivision = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.errorDivision.toString()
      let errorTransfer = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.errorTransfer.toString()
      let substitutions = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.substitutions.toString()
      let errorDecimalPoint = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.errorDecimalPoint.toString()
      let addition = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.addition.toString()
      let subtraction = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.subtraction.toString()
      let multiplication = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.multiplication.toString()
      let division = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.division.toString()
      let anyOtherArithmetic = this.seData.specificEducationalAreas.presentLiteracy.aritmeticComputation.anyOther.toString()

      let readStorySum = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.readStorySum.toString()
      let explainStorySum = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.explainStorySum.toString()
      let additionReasoning = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.addition.toString()
      let subtractionReasonsing = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.subtraction.toString()
      let mutiplicationReasoning = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.mutiplication.toString()
      let divisionReasoning = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.division.toString()
      let anyOtherReasoning = this.seData.specificEducationalAreas.presentLiteracy.arithmeticReasoning.anyOther.toString()

      let testAdministered = this.seData.specificEducationalAreas.testAdministered.toString()
      let impressions = this.seData.specificEducationalAreas.impressions.toString()
      let observations = this.seData.specificEducationalAreas.observations.toString()
      let recommendations = this.seData.specificEducationalAreas.recommendations.toString()

      let provisonalDiadnosis = this.seData.provisonalDiadnosis.toString()
      let environmentalStreams = this.seData.environmentalStreams.toString()
      let environmentalBarriers = this.seData.environmentalBarriers.toString()

      this.seAssessmentForm.patchValue({
        informant : informant,
        strengthChild : strengthChild,
        parentalConcern : parentalConcern,
        fuctionalAreas : ({
          learningAndApplying : ({
            watching : watching,
            listening : listening,
            memory : memory,
            attention : attention,
            solvingProblem : solvingProblem,
            socialProblem : socialProblem,
            motivationalProblems : motivationalProblems,
            emotionalProblems : emotionalProblems,
          }),
          perceptualMotorSkills : ({
            visual : visual,
            auditory : auditory,
            motorCordination : motorCordination,
            spatialOrientation : spatialOrientation,
            learningStyle : learningStyle,
            handedness : handedness
          }),
          generalTasks : ({
            singleTasks : singleTasks,
            multipleTasks : multipleTasks,
          }),
          communication : ({
            spokenMessages : spokenMessages,
            nonVerbalMessages : nonVerbalMessages,
            speaking : speaking,
            producingMessage : producingMessage,
            conversation : conversation
          }),
          mobility : ({
            lifting : lifting,
            fineHand : fineHand,
            walkingStairs : walkingStairs,
            movingAround : movingAround,
            usingTransportation : usingTransportation,
            driving : driving
          }),
          selfCare : ({
            washingOneself : washingOneself,
            bodyParts : bodyParts,
            toiletting : toiletting,
            dressing : dressing,
            eating : eating,
            drinking : drinking
          }),
          domesticSelf : ({
            acquisition : acquisition,
            householdWork : householdWork,
            assisting : assisting
          }),
          interpersonalInteractons : ({
            basic : basic,
            withStrangers : withStrangers,
            formalRelation : formalRelation,
            informalRelation : informalRelation,
            familyRelation : familyRelation
          }),
          majorLifeAreas : ({
            informalEducation : informalEducation,
            schoolEducation : schoolEducation,
            higherEducation : higherEducation
          }),
          communityLife : communityLife,
          functionalAbilities : functionalAbilities,
        }),

        specificEducationalAreas : ({
          materialsUsed : materialsUsed,
          objectInteraction :objectInteraction,
          communicationLanguage : ({
            expressive : expressive,
            receptive : receptive
          }),
          concepts : ({
            color : color,
            shapes : shapes,
            size : size,
            quantity : quantity,
            matching : matching,
            similarities : similarities,
            differences : differences,
            classification : classification,
          }),
          seriation : seriation,
          oneToOne : oneToOne,
          reversibility : reversibility,
          specialConcepts : specialConcepts,
          earlyLiteracy : ({
            preReading : ({
              namePicture : namePicture,
              whatTheySee : whatTheySee,
              handleBook : handleBook,
              alphabets : alphabets,
              sightWords : sightWords,
              letterSound : letterSound
            }),
            preWriting : ({
              horizontalStroke : horizontalStroke,
              verticalStroke : verticalStroke,
              circularScribble : circularScribble,
              plusShape : plusShape,
              square : square,
              triangle : triangle,
              grasp : grasp,
              capitalAlphabets : capitalAlphabets,
              smallAlphabets : smallAlphabets
            }),
            preMaths : ({
              roteCount : roteCount,
              recognitionNumeral : recognitionNumeral,
              meaningfulCounting : meaningfulCounting,
              moreLess : moreLess
            })
          }),
          presentLiteracy : ({
            reading : ({
              phoneticAwareness : phoneticAwareness,
              fingerTracing : fingerTracing,
              spellingAloud :spellingAloud,
              omitsWord :omitsWord,
              substituteWord : substituteWord,
              ignorePunctuation : ignorePunctuation,
              posture : posture,
              loudVoice : loudVoice,
              distanceBookEye : distanceBookEye,
              reading : reading,
              addWord : addWord,
              mispronounceWord : mispronounceWord,
              pronounceWord : pronounceWord,
              specify : specify
            }),
            writing : ({
              leftToRight : leftToRight,
              ignoreMargin : ignoreMargin,
              ignoreLine : ignoreLine,
              overWritting : overWritting,
              posture : postureWriting,
              writingStyle : writingStyle,
              mixingCapitalSmall : mixingCapitalSmall,
              omits : omits,
              spaciningLine : spaciningLine,
              puctuations : puctuations,
              letterReversal : letterReversal,
              wordReversal :wordReversal,
              anyOther : anyOther
            }),
            spelling : ({
              sightWords : sightWordsSpelling,
              cvcWords : cvcWords,
              blendWords : blendWords,
              consonant : consonant,
              anyOther : anyOtherSpelling
            }),
            readingComprehension : ({
              promptAnswers : promptAnswers,
              repeatedQuestion : repeatedQuestion,
              transalatedQuestion : transalatedQuestion,
              answerReadingMaterial : answerReadingMaterial,
              refusesOrRepeats : refusesOrRepeats,
              anyOther : anyOtherComprehension
            }),
            aritmeticComputation : ({
              rightLeft : rightLeft,
              operationalSymbols : operationalSymbols,
              placeValues : placeValues,
              fingerCounting : fingerCounting,
              drawAddtion : drawAddtion,
              darwSubtraction : darwSubtraction,
              ignoreAddition : ignoreAddition,
              ignoreSubtraction :ignoreSubtraction,
              errorMultplication : errorMultplication,
              errorDivision : errorDivision,
              errorTransfer : errorTransfer,
              substitutions : substitutions,
              errorDecimalPoint : errorDecimalPoint,
              addition : addition,
              subtraction : subtraction,
              multiplication : multiplication,
              division : division,
              anyOther : anyOtherArithmetic
            }),
            arithmeticReasoning : ({
              readStorySum : readStorySum,
              explainStorySum : explainStorySum,
              addition : additionReasoning,
              subtraction : subtractionReasonsing,
              mutiplication : mutiplicationReasoning,
              division : divisionReasoning,
              anyOther : anyOtherReasoning
            })
          }),
          testAdministered : testAdministered,
          impressions : impressions,
          observations : observations,
          recommendations : recommendations
        }),
        provisonalDiadnosis : provisonalDiadnosis,
        environmentalStreams : environmentalStreams,
        environmentalBarriers : environmentalBarriers
      })
    })
  }

  se : any;
  submitS: Subscription;
  onSubmit(){
    let data = {
        informant : this.seAssessmentForm.get('informant').value,
        strengthChild : this.seAssessmentForm.get('strengthChild').value,
        parentalConcern : this.seAssessmentForm.get('parentalConcern').value,
        fuctionalAreas : ({
          learningAndApplying : ({
            watching : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.watching').value,
            listening : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.listening').value,
            memory : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.memory').value,
            attention : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.attention').value,
            solvingProblem : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.solvingProblem').value,
            socialProblem : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.socialProblem').value,
            motivationalProblems : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.motivationalProblems').value,
            emotionalProblems : this.seAssessmentForm.get('fuctionalAreas.learningAndApplying.emotionalProblems').value,
          }),
          perceptualMotorSkills : ({
            visual : this.seAssessmentForm.get('fuctionalAreas.perceptualMotorSkills.visual').value,
            auditory : this.seAssessmentForm.get('fuctionalAreas.perceptualMotorSkills.auditory').value,
            motorCordination : this.seAssessmentForm.get('fuctionalAreas.perceptualMotorSkills.motorCordination').value,
            spatialOrientation : this.seAssessmentForm.get('fuctionalAreas.perceptualMotorSkills.spatialOrientation').value,
            learningStyle : this.seAssessmentForm.get('fuctionalAreas.perceptualMotorSkills.learningStyle').value,
            handedness : this.seAssessmentForm.get('fuctionalAreas.perceptualMotorSkills.handedness').value
          }),
          generalTasks : ({
            singleTasks : this.seAssessmentForm.get('fuctionalAreas.generalTasks.singleTasks').value,
            multipleTasks : this.seAssessmentForm.get('fuctionalAreas.generalTasks.multipleTasks').value,
          }),
          communication : ({
            spokenMessages : this.seAssessmentForm.get('fuctionalAreas.communication.spokenMessages').value,
            nonVerbalMessages : this.seAssessmentForm.get('fuctionalAreas.communication.nonVerbalMessages').value,
            speaking : this.seAssessmentForm.get('fuctionalAreas.communication.speaking').value,
            producingMessage : this.seAssessmentForm.get('fuctionalAreas.communication.producingMessage').value,
            conversation : this.seAssessmentForm.get('fuctionalAreas.communication.conversation').value
          }),
          mobility : ({
            lifting : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            fineHand : this.seAssessmentForm.get('fuctionalAreas.mobility.fineHand').value,
            walkingStairs : this.seAssessmentForm.get('fuctionalAreas.mobility.walkingStairs').value,
            movingAround : this.seAssessmentForm.get('fuctionalAreas.mobility.movingAround').value,
            usingTransportation : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            driving : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value
          }),
          selfCare : ({
            washingOneself : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            bodyParts : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            toiletting : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            dressing : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            eating : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value,
            drinking : this.seAssessmentForm.get('fuctionalAreas.mobility.lifting').value
          }),
          domesticSelf : ({
            acquisition : this.seAssessmentForm.get('fuctionalAreas.domesticSelf.acquisition').value,
            householdWork : this.seAssessmentForm.get('fuctionalAreas.domesticSelf.householdWork').value,
            assisting : this.seAssessmentForm.get('fuctionalAreas.domesticSelf.assisting').value
          }),
          interpersonalInteractons : ({
            basic : this.seAssessmentForm.get('fuctionalAreas.interpersonalInteractons.basic').value,
            withStrangers : this.seAssessmentForm.get('fuctionalAreas.interpersonalInteractons.withStrangers').value,
            formalRelation : this.seAssessmentForm.get('fuctionalAreas.interpersonalInteractons.formalRelation').value,
            informalRelation : this.seAssessmentForm.get('fuctionalAreas.interpersonalInteractons.informalRelation').value,
            familyRelation : this.seAssessmentForm.get('fuctionalAreas.interpersonalInteractons.familyRelation').value
          }),
          majorLifeAreas : ({
            informalEducation : this.seAssessmentForm.get('fuctionalAreas.majorLifeAreas.informalEducation').value,
            schoolEducation : this.seAssessmentForm.get('fuctionalAreas.majorLifeAreas.schoolEducation').value,
            higherEducation : this.seAssessmentForm.get('fuctionalAreas.majorLifeAreas.higherEducation').value
          }),
          communityLife : this.seAssessmentForm.get('fuctionalAreas.communityLife').value,
          functionalAbilities : this.seAssessmentForm.get('fuctionalAreas.functionalAbilities').value,
        }),

        specificEducationalAreas : ({
          materialsUsed : this.seAssessmentForm.get('specificEducationalAreas.materialsUsed').value,
          objectInteraction :this.seAssessmentForm.get('specificEducationalAreas.objectInteraction').value,
          communicationLanguage : ({
            expressive : this.seAssessmentForm.get('specificEducationalAreas.communicationLanguage.expressive').value,
            receptive : this.seAssessmentForm.get('specificEducationalAreas.communicationLanguage.receptive').value
          }),
          concepts : ({
            color : this.seAssessmentForm.get('specificEducationalAreas.concepts.color').value,
            shapes : this.seAssessmentForm.get('specificEducationalAreas.concepts.shapes').value,
            size : this.seAssessmentForm.get('specificEducationalAreas.concepts.size').value,
            quantity : this.seAssessmentForm.get('specificEducationalAreas.concepts.quantity').value,
            matching : this.seAssessmentForm.get('specificEducationalAreas.concepts.matching').value,
            similarities : this.seAssessmentForm.get('specificEducationalAreas.concepts.similarities').value,
            differences : this.seAssessmentForm.get('specificEducationalAreas.concepts.differences').value,
            classification : this.seAssessmentForm.get('specificEducationalAreas.concepts.classification').value,
          }),
          seriation : this.seAssessmentForm.get('specificEducationalAreas.seriation').value,
          oneToOne : this.seAssessmentForm.get('specificEducationalAreas.oneToOne').value,
          reversibility : this.seAssessmentForm.get('specificEducationalAreas.reversibility').value,
          specialConcepts : this.seAssessmentForm.get('specificEducationalAreas.specialConcepts').value,
          earlyLiteracy : ({
            preReading : ({
              namePicture : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preReading.namePicture').value,
              whatTheySee : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preReading.whatTheySee').value,
              handleBook : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preReading.handleBook').value,
              alphabets : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preReading.alphabets').value,
              sightWords : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preReading.sightWords').value,
              letterSound : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preReading.letterSound').value
            }),
            preWriting : ({
              horizontalStroke : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.horizontalStroke').value,
              verticalStroke : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.verticalStroke').value,
              circularScribble : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.circularScribble').value,
              plusShape : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.plusShape').value,
              square : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.square').value,
              triangle : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.triangle').value,
              grasp : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.grasp').value,
              capitalAlphabets : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.capitalAlphabets').value,
              smallAlphabets : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preWriting.smallAlphabets').value
            }),
            preMaths : ({
              roteCount : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preMaths.roteCount').value,
              recognitionNumeral : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preMaths.recognitionNumeral').value,
              meaningfulCounting : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preMaths.meaningfulCounting').value,
              moreLess : this.seAssessmentForm.get('specificEducationalAreas.earlyLiteracy.preMaths.moreLess').value
            })
          }),
          presentLiteracy : ({
            reading : ({
              phoneticAwareness : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.phoneticAwareness').value,
              fingerTracing : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.fingerTracing').value,
              spellingAloud :this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.spellingAloud').value,
              omitsWord :this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.omitsWord').value,
              substituteWord : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.substituteWord').value,
              ignorePunctuation : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.ignorePunctuation').value,
              posture : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.posture').value,
              loudVoice : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.loudVoice').value,
              distanceBookEye : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.distanceBookEye').value,
              reading : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.reading').value,
              addWord : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.addWord').value,
              mispronounceWord : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.mispronounceWord').value,
              pronounceWord : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.pronounceWord').value,
              specify : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.reading.specify').value
            }),
            writing : ({
              leftToRight : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.leftToRight').value,
              ignoreMargin : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.ignoreMargin').value,
              ignoreLine : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.ignoreLine').value,
              overWritting : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.overWritting').value,
              posture : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.posture').value,
              writingStyle : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.writingStyle').value,
              mixingCapitalSmall : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.mixingCapitalSmall').value,
              omits : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.omits').value,
              spaciningLine : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.spaciningLine').value,
              puctuations : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.puctuations').value,
              letterReversal : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.letterReversal').value,
              wordReversal :this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.wordReversal').value,
              anyOther : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.writing.anyOther').value
            }),
            spelling : ({
              sightWords : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.spelling.sightWords').value,
              cvcWords : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.spelling.cvcWords').value,
              blendWords : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.spelling.blendWords').value,
              consonant : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.spelling.consonant').value,
              anyOther : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.spelling.anyOther').value
            }),
            readingComprehension : ({
              promptAnswers : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.readingComprehension.promptAnswers').value,
              repeatedQuestion : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.readingComprehension.repeatedQuestion').value,
              transalatedQuestion : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.readingComprehension.transalatedQuestion').value,
              answerReadingMaterial : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.readingComprehension.answerReadingMaterial').value,
              refusesOrRepeats : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.readingComprehension.refusesOrRepeats').value,
              anyOther : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.readingComprehension.anyOther').value
            }),
            aritmeticComputation : ({
              rightLeft : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.rightLeft').value,
              operationalSymbols : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.operationalSymbols').value,
              placeValues : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.placeValues').value,
              fingerCounting : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.fingerCounting').value,
              drawAddtion : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.drawAddtion').value,
              darwSubtraction : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.darwSubtraction').value,
              ignoreAddition : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.ignoreAddition').value,
              ignoreSubtraction :this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.ignoreSubtraction').value,
              errorMultplication : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.errorMultplication').value,
              errorDivision : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.errorDivision').value,
              errorTransfer : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.errorTransfer').value,
              substitutions : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.substitutions').value,
              errorDecimalPoint : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.errorDecimalPoint').value,
              addition : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.addition').value,
              subtraction : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.subtraction').value,
              multiplication : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.multiplication').value,
              division : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.division').value,
              anyOther : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.aritmeticComputation.anyOther').value
            }),

            arithmeticReasoning : ({
              readStorySum : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.readStorySum').value,
              explainStorySum : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.explainStorySum').value,
              addition : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.addition').value,
              subtraction : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.subtraction').value,
              mutiplication : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.mutiplication').value,
              division : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.division').value,
              anyOther : this.seAssessmentForm.get('specificEducationalAreas.presentLiteracy.arithmeticReasoning.anyOther').value
            })
          }),
          testAdministered : this.seAssessmentForm.get('specificEducationalAreas.testAdministered').value,
          impressions : this.seAssessmentForm.get('specificEducationalAreas.impressions').value,
          observations : this.seAssessmentForm.get('specificEducationalAreas.observations').value,
          recommendations : this.seAssessmentForm.get('specificEducationalAreas.recommendations').value
        }),
        provisonalDiadnosis : this.seAssessmentForm.get('provisonalDiadnosis').value,
        environmentalStreams : this.seAssessmentForm.get('environmentalStreams').value,
        environmentalBarriers : this.seAssessmentForm.get('environmentalBarriers').value
    }
    this.submitS = this.therapistService.editSeAssessmentForm(data, this.activatedRoute.snapshot.params['id']).subscribe((res)=>{
      history.back()
      this._snackBar.open(" Upated successfully...","" ,{duration:3000})
      this.clearControls()
    },(error=>{
      console.log(error)
      alert(error)
    }))
  }

  clearControls(){
    this.seAssessmentForm.reset()
  }
}
