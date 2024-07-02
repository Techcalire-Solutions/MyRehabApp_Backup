const mongoose = require('mongoose')

const performanceAreasSchema = new mongoose.Schema({
    dailyLiving:{
        grooming:{type:String},
        oralHygiene:{type:String},
        bathing:{type:String}, 
        toiletHygiene:{type:String},
        dressing:{type:String},
        functionalMobility:{type:String},      
    },
    educational: {type:String},
    playAndLeisure: {type:String}
})

const performanceComponentsSchema = new mongoose.Schema({
    sensorymotor:{
        sensoryIntegration:{
            sensoryAwareness: {type: String},
            sensoryProcessing: {type: String},
            interpretAbility: {
                tactile: {type: String},
                propriceptive: {type: String},
                vestibular: {type: String},
                auditory: {type: String},
                visual: {type: String},
                gustatory: {type: String},
                olfactory: {type: String}
            }
        },
        perceptualSkills: {
            stereognosis: {type: String},
            kinesthesia: {type: String},
            bodyScheme: {type: String},
            rlDiscrimination: {type: String},
            formConstancy: {type: String},
            positionSpace: {type: String},
            visualClosure: {type: String},
            groundDiscrimination: {type: String},
            depthPerception: {type: String},
            topographicalOrientation: {type: String}
        }
           
    },
    neuroMuscular: {
        rom: {type: String},
        muscleTone: {type: String},
        tightness: {type: String},
        contracture: {type: String},
        deformity: {type: String},
        muscleStrength: {type: String},
        endurance: {type: String},
        posturalSitting: {type: String},
        posturalStanding: {type: String},
        gait: {type: String},
        otherFindings: {type: String}
    },
    motor: {
        activityTolerance: {type: String},
        grossMotor: {type: String},
        midlineCrossing: {type: String},
        laterality: {type: String},
        bilateralIntegration: {type: String},
        praxis: {type: String},
        fineMotor: {type: String},
        standingBalance: {type: String},
        oralMotor: {type: String}
    },
    handFunction: {
        reach: {
            right: {type: String},
            left: {type: String}
        },
        grasp: {
            right: {type: String},
            left: {type: String}
        },
        prehension: {
            right: {type: String},
            left: {type: String}
        },
        opposition: {
            right: {type: String},
            left: {type: String}
        },
        release: {
            right: {type: String},
            left: {type: String}
        },
        preWriting: {
            right: {type: String},
            left: {type: String}
        }
    },

    cognitiveFunctioning:{
        cognitiveIntegration:{
            arousal: {type: String},
            initiationActivity: {type: String},
            terminationActivity: {type: String},
            orientationTime: {type: String},
            orientationPlace: {type: String},
            recognition: {type: String},
        },
        cognitiveComponent: {
            attentionSpan: {type: String},
            concentrationSpan: {type: String},
            stm: {type: String},
            ltm: {type: String},
            recentMemory: {type: String},
            workingMemory: {type: String},
            sequencing: {type: String},
            categorisation: {type: String},
            conceptFormation: {type: String},
            problemSolving: {type: String},
            generalisationLearning: {type: String},
        }
    }

})

const otAssessmentSchema = new mongoose.Schema({
    date:{type:Date, default:Date.now},
    updatedDate:{type:Date, default:Date.now},
    assessmentMasterId:{type:mongoose.Schema.Types.ObjectId,ref:'AssessmentMaster'},
    medicalDiagnosis: {type: String},
    generalAppearence: {type: String},
    onObservation: {type: String},
    performanceAreas: performanceAreasSchema,
    performanceComponents: performanceComponentsSchema,
    remarks: {type: String}
})

const otAssessmentModel = mongoose.model('OtAssessment',otAssessmentSchema)

module.exports = otAssessmentModel