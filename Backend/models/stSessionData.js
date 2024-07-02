const mongoose = require('mongoose')


const preLinguisticSchema = new mongoose.Schema(
    {
        joinAttention : {type: String},
        imitation : {type: String},
        remarks : {type: String}
    }
)

const linguisticSchema = new mongoose.Schema(
    {
        lexicalItems : {type: String},
        advancedConcepts : {type: String},
        syntacticStructures : {type: String},
        pragmaticSkills : {type: String},
        remarks : {type: String}
    }
)

const communicationSchema = new mongoose.Schema(
    {
        functional : {type: String},
        gestrual : {type: String},
        aac : {type: String},
        assistive : {type: String},
        remarks : {type: String}
    }
)

const cognitionSchema = new mongoose.Schema(
    {
        basicSkills : {type: String},
        advancedSkills : {type: String},
        remarks : {type: String}
    }
)

const playSchema = new mongoose.Schema(
    {
        parallel : {type: String},
        symbolic : {type: String},
        constructive : {type: String},
        pretend : {type: String},
        physical : {type: String},
        exploratory : {type: String},
        sensoryStimulating : {type: String},
        associative : {type: String},
        onlooker : {type: String},
        remarks : {type: String}
    }
)

const articulationSchema = new mongoose.Schema(
    {
        auditoryDescrimination : {type: String},
        phonology : {type: String},
        placement : {type: String},
        generalization : {type: String},
        wordLevel : {type: String},
        phraseLevel : {type: String},
        remarks : {type: String}
    }
)

const oroMotorSchema = new mongoose.Schema(
    {
        opt : {type: String},
        hypoSensitive : {type: String},
        mixedSensitive : {type: String},
        hyperSensitive : {type: String},
        sucking : {type: String},
        blowing : {type: String},
        chewing : {type: String},
        remarks : {type: String}
    }
)

const fluencySchema = new mongoose.Schema(
    {
        fluencyShaping : {type: String},
        fluencyModification : {type: String},
        generalization : {type: String},
        maintenance : {type: String},
        remarks : {type: String}
    }
)

const voiceSchema = new mongoose.Schema(
    {
        respiratory : {type: String},
        resonance : {type: String},
        pitch : {type: String},
        loudness : {type: String},
        relaxationExercises : {type: String},
        strengtheningExercises : {type: String},
        remarks : {type: String}
    }
)

const stSessionSchema = new mongoose.Schema(
    {
        date:{type:Date, default:Date.now},
        updatedDate:{type:Date, default:Date.now},
        session_master_id:{type:mongoose.Schema.Types.ObjectId,ref:'SessionMaster'},
        preLinguistic : preLinguisticSchema,
        linguistic : linguisticSchema,
        communication : communicationSchema,
        cognition : cognitionSchema,
        play : playSchema,
        articulation : articulationSchema,
        oroMotor : oroMotorSchema,
        fluency : fluencySchema,
        voice : voiceSchema,
    }
)



const StSessionModel = mongoose.model('StSession',stSessionSchema)

module.exports = StSessionModel