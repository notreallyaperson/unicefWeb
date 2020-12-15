const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const parameterSchema = new Schema(
    // Array of all the words to be in the vccabulary
    {
        vocabulary: [], // start of at about 7000 words
        length: {
            type: Int32Array
        },
        sizeOfCorpus: {
            type: Int32Array
        },
        sizeOfBatch: {
            type: Int32Array
        },
        iteration: {
            type: Int32Array
        },
        lamdaId: {
            type: String
        },
        startPoint: {
            type: Int32Array
        },
        articleCount: {
            type: Int32Array
        }
    },
    {
        timestamps: true,
    }
);

const LdaModel = mongoose.model('articles', parameterSchema);

module.exports = LdaModel;
