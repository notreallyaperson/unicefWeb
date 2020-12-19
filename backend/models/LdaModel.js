const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const parameterSchema = new Schema(
    // Array of all the words to be in the vccabulary
    {
        vocabulary: [], // start of at about 7000 words
        length: {
            type: Number
        },
        sizeOfCorpus: {
            type: Number
        },
        sizeOfBatch: {
            type: Number
        },
        iteration: {
            type: Number
        },
        lamdaId: {
            type: String
        },
        startPoint: {
            type: Number
        },
        endPoint: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

const LdaModel = mongoose.model('ldamodels', parameterSchema);

module.exports = LdaModel;
