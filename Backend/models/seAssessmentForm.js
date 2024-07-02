const mongoose = require('mongoose')

const functionalAreasSchema = new mongoose.Schema({
    learningAndApplying : {
        watching : {type:String},
        listening : {type:String},
        memory : {type:String},
        attention : {type:String},
        solvingProblem : {type:String},
        socialProblem : {type:String},
        motivationalProblems : {type:String},
        emotionalProblems : {type:String},
    },
    perceptualMotorSkills : {
        visual : {type:String},
        auditory : {type:String},
        motorCordination : {type:String},
        spatialOrientation : {type:String},
        learningStyle : {type:String},
        handedness : {type:String},
    },
    generalTasks : {
        singleTasks : {type:String},
        multipleTasks : {type:String},
    },
    communication : {
        spokenMessages : {type:String},
        nonVerbalMessages : {type:String},
        speaking : {type:String},
        producingMessage : {type:String},
        conversation : {type:String}
    },
    mobility : {
        lifting : {type:String},
        fineHand : {type:String},
        walkingStairs : {type:String},
        movingAround : {type:String},
        usingTransportation : {type:String},
        driving : {type:String}
    },
    selfCare : {
        washingOneself : {type:String},
        bodyParts : {type:String},
        toiletting : {type:String},
        dressing : {type : String},
        eating : {type : String},
        drinking : {type : String}
    },
    domesticSelf : {
        acquisition : {type : String},
        householdWork : {type : String},
        assisting : {type : String}
    },
    interpersonalInteractons : {
        basic : {type:String},
        withStrangers : {type:String},
        formalRelation : {type:String},
        informalRelation : {type:String},
        familyRelation : {type:String}
    },
    majorLifeAreas : {
        informalEducation : {type : String},
        schoolEducation : {type : String},
        higherEducation : {type : String}
    },
    communityLife : {type:String},
    functionalAbilities : {type:String},
})

const specificEducationalAreasSchema = new mongoose.Schema({
    materialsUsed : {type: String},
    objectInteraction : {type: String},
    communicationLanguage : {
        expressive : {type: String},
        receptive : {type: String},
    },
    concepts : {
        color : {type : String},
        shapes : {type: String},
        size : {type: String},
        quantity : {type: String},
        matching : {type: String},
        similarities : {type: String},
        differences : {type: String},
        classification : {type: String},
    },
    seriation : {type: String},
    oneToOne : {type: String},
    reversibility : {type: String},
    specialConcepts : {type: String},
    earlyLiteracy : {
        preReading : {
            namePicture : {type: String},
            whatTheySee : {type: String},
            handleBook : {type: String},
            alphabets : {type: String},
            sightWords : {type: String},
            letterSound : {type: String}
        },
        preWriting : {
            horizontalStroke : {type : String},
            verticalStroke : {type: String},
            circularScribble : {type: String},
            plusShape : {type: String},
            square : {type: String},
            triangle : {type: String},
            grasp : {type: String},
            capitalAlphabets : {type: String},
            smallAlphabets : {type: String}
        },
        preMaths : {
            roteCount : {type: String},
            recognitionNumeral : {type: String},
            meaningfulCounting : {type: String},
            moreLess : {type: String}
        }
    },
    presentLiteracy : {
        reading : {
            phoneticAwareness : {type: String},
            fingerTracing : {type: String},
            spellingAloud : {type: String},
            omitsWord : {type: String},
            substituteWord : {type: String},
            ignorePunctuation : {type: String},
            posture : {type: String},
            loudVoice : {type: String},
            distanceBookEye : {type: String},
            reading : {type: String},
            addWord : {type: String},
            mispronounceWord : {type: String},
            pronounceWord : {type: String},
            specify : {type: String}
        },
        writing : {
            leftToRight : {type: String},
            ignoreMargin : {type: String},
            ignoreLine : {type: String},
            overWritting : {type: String},
            posture : {type: String},
            writingStyle : {type: String},
            mixingCapitalSmall : {type: String},
            omits : {type: String},
            spaciningLine : {type: String},
            puctuations : {type: String},
            letterReversal : {type: String},
            wordReversal : {type: String},
            anyOther : {type: String}
        },
        spelling : {
            sightWords : {type: String},
            cvcWords : {type: String},
            blendWords : {type: String},
            consonant : {type: String},
            anyOther : {type: String}
        },
        readingComprehension : {
            promptAnswers : {type: String},
            repeatedQuestion : {type: String},
            transalatedQuestion : {type: String},
            answerReadingMaterial : {type: String},
            refusesOrRepeats : {type: String},
            anyOther : {type: String}   
        },
        aritmeticComputation : {
            rightLeft : {type: String},
            operationalSymbols : {type: String},
            placeValues : {type: String},
            fingerCounting : {type: String},
            drawAddtion : {type: String},
            darwSubtraction : {type: String},
            ignoreAddition : {type: String},
            ignoreSubtraction : {type: String},
            errorMultplication : {type: String},
            errorDivision : {type: String},
            errorTransfer : {type: String},
            substitutions : {type: String},
            errorDecimalPoint : {type: String},
            addition : {type: String},
            subtraction : {type: String},
            multiplication : {type: String},
            division : {type: String},
            anyOther : {type: String}
        },
        arithmeticReasoning : {
            readStorySum : {type: String},
            explainStorySum : {type: String},
            addition : {type: String},
            subtraction : {type: String},
            mutiplication : {type: String},
            division : {type: String},
            anyOther : {type: String}
        }
    },
    testAdministered : {type: String},
    impressions : {type: String},
    observations : {type: String},
    recommendations : {type: String}
})

const seAssessmentSchema = new mongoose.Schema({
    date:{type:Date, default:Date.now},
    updatedDate:{type:Date, default:Date.now},
    assessmentMasterId:{type:mongoose.Schema.Types.ObjectId,ref:'AssessmentMaster'},
    informant : {type : String},
    strengthChild : {type:String},
    parentalConcern : {type:String},
    fuctionalAreas : functionalAreasSchema,
    specificEducationalAreas : specificEducationalAreasSchema,
    provisonalDiadnosis : {type: String},
    environmentalStreams : {type: String},
    environmentalBarriers : {type: String}
})

const seAssessmentModel = mongoose.model('SeAssessment',seAssessmentSchema)

module.exports = seAssessmentModel