// Get lamda from mongodb

// Get Parameters from mongodb

/*
    startPoint: {
        type: Int32Array
    },
    articleCount: {
        type: Int32Array
    }
    if articleCount >= sizeOfCorpus do not train model

*/

// get all articles from mongoDB (only id and content required)
/*
get articles from articleCount position onwards
if length < sizeOfBatch do not run
randomize all the articles
*/


// Run training model with articles (kheeran to complete python)
/*
    input =  {
        vocabulary: [], // start of at about 7000 words
        sizeOfCorpus: 100,000, is a multiple of the sizeOfBatch
        sizeOfBatch: 10,000
        iteration: 0,
        articles: [] array of all article content matching size of batch
    }
    output = {
        gamma: [[], []]
        [   array the length of articles
            [
                array of floats length equal to number of topics
            ]
        ]
        lamda: [[], []]
    }
*/

// receive returned new Lamda and gamma array 

// save new lamda value as a new document

// map gamma arrays to respective mongoDB article and update to mongoDB (push into array for gamma)
/*
    value: gamma array,
    ldaModelId: {
        type: String
    },
    lamdaId: {
        type: String
    },
*/

// update iteration and article count in LDA model
