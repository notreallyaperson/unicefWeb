'''
This file is for supporting functions to the main online topic modelling algorithm
'''

import re
import numpy as np
from scipy.special import gammaln, psi

np.random.seed(100000001)


# Preparing the raw text of a document for the algorithm (removing stopwords and unwanted characters)
# function of type string -> string
def prep_text(doc):
    prepped_doc = doc.lower()
    # prepped_doc = re.sub(r'(https:\/\/|http:\/\/|www)(www)*[^\s]*', '', prepped_doc) # remove URLs
    prepped_doc = re.sub(r'[^a-z ]', '', prepped_doc) # keep only letters and spaces
    prepped_doc = re.sub(r' +', ' ', prepped_doc) # remove multiple spaces
    return prepped_doc

# prepping the corpus of documents
# function of type list of strings -> list of strings
def prep_docs(docs):
    return list(map(prep_text, docs))


# Define the list of stopwords from sklearn (with a few other non-topical words)
# function of type None -> list of strings
def stopwords():
    stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'youre', 'youve', 'youll', 'youd', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'shes', 'her', 'hers', 'herself', 'it', 'its', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'thatll', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'dont', 'should', 'shouldve', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'arent', 'couldn', 'couldnt', 'didn', 'didnt', 'doesn', 'doesnt', 'hadn', 'hadnt', 'hasn', 'hasnt', 'haven', 'havent', 'isn', 'isnt', 'ma', 'mightn', 'mightnt', 'mustn', 'mustnt', 'needn', 'neednt', 'shan', 'shant', 'shouldn', 'shouldnt', 'wasn', 'wasnt', 'weren', 'werent', 'wont', 'wouldn', 'wouldnt', 'would', 'also', 'like', 'however', 'although', 'hence', 'otherwise', 'moreover', 'additionally', 'futhermore', 'even', 'many', 'made', 'much', 'must', 'come', 'need', 'still', 'could', 'though', 'make', 'rather', 'since', 'well', 'back', 'thus', 'then', 'going']

    # externally save the stopwords
    with open('stopwords.txt', 'w') as f:
        for word in stopwords:
            f.write("%s\n" % word)

    return stopwords

# Creating the vocabulary list from prepped corpus of documents
# function of type list of strings, list of strings -> list of strings
def docs_to_vocab(docs, stopwords=stopwords()):
    vocab = []
    for doc in docs:
        words = doc.split()
        for word in words:
            if (len(word) > 2): # exclude words shorter than 2 characters
                if (not word in stopwords): # exclude list of stopwords
                    if(not word in vocab):
                        vocab.append(word)

    # externally save the vocabulary
    with open('vocabulary.txt', 'w') as f:
        for word in vocab:
            f.write("%s\n" % word)

    return vocab

# Creating the vocabulary mappings object from the list (tokenisation)
# function of type list of strings -> object
def vocab_to_obj(vocab, stopwords=stopwords()):
    vocab_obj = {}
    for word in vocab:
        if (len(word) > 2):
            if (not word in stopwords):
                if (not word in vocab_obj):
                    vocab_obj[word] = len(vocab_obj)

    return vocab_obj


# Pre-processing the prepped corpus of documents to get word IDs and word counts using the prepped vocabulary
# function of type list of strings, object -> list of ints, list of ints
def process_docs(docs, vocab):
    docs_word_ids = []
    docs_word_cts = []
    for doc in docs:
        words = doc.split()
        doc_obj = {}
        for word in words:
            if (word in vocab):
                token = vocab[word]
                if (not token in doc_obj):
                    doc_obj[token] = 0
                doc_obj[token] += 1
        docs_word_ids.append(doc_obj.keys())
        docs_word_cts.append(doc_obj.values())

    return (docs_word_ids, docs_word_cts)

# Produce random dirichlet parameters for the LDA model
# function of type tuple -> numpy array of shape tuple
def rand_hyperparam(shape):
    return np.random.gamma(100., 1./100., shape)

# # Prepare the shape of the hyper parameters
# def prep_hyperparam(hyperparam, shape):
#     hp = np.array(hyperparam)
#     if hp.shape != shape:
#

# Calculate the dirichlet expectation given the dir params
def dirichlet_expectation(dir_param):
    if (len(dir_param.shape) == 1):
        return(psi(dir_param) - psi(np.sum(dir_param)))
    return(psi(dir_param) - psi(np.sum(dir_param, 1))[:, np.newaxis])


class OnlineLDA(object):
    """
    Class for the online LDA model initialised with the following arguments:
    - vocab: a list of V words as the vocabulary (any other words will be ignored) - list of strings
    - D: the expected size of the entire corpus (i.e. 100,000 docs) - int
    - S: the size of each batch of articles - int
    - K: the number of topics - int
    - alpha: the hyperparam prior for the documents' topic distributions param theta - float
    - eta: the prior for the topics' word distributions param beta (lambda) - list of list of floats or float
    - tau: a hyperparam of the optimiser step size to downweight early samples (tau>=0)
    - kappa: a hyperparam of the optimiser step size to alter the learning rate (kappa \in (0.5, 1])

    -T: memory variable to continue previous job from batch T

    Model from [Hoffman et al 2013].
    """

    def __init__(self, vocab, D, S, K, alpha, eta, tau=4096, kappa=0.7, T=1):
        # super().__init__()

        self._vocab = vocab_to_obj(vocab)
        self._D = int(D)
        self._S = int(S)
        self._K = int(K)
        self._alpha = float(alpha)
        self._eta = float(eta)

        # Validity check
        if (tau >=0):
            self._tau = float(tau)
        else:
            self._tau = float(4096)
            print("tau out of range, overwritting to tau=4096.0")

        # Validity check
        if (0.5 < kappa <= 1):
            self._kappa = float(kappa)
        else:
            print("kappa out of range, overwritting to kappa=0.7")
            self._kappa = float(0.7)

        if (T > 0):
            self._T = int(T)
        else:
            print("T invalid, overwritting to T=1")
            self._T = int(1)

        self._V = len(vocab)

        # initialise the mean-field dist hyperparam lambda (dirichlet param)
        self._lambda = rand_hyperparam((self._K, self._V))
        self._Elogbeta = dirichlet_expectation(self._lambda)
        self._expElogbeta = np.exp(self._Elogbeta)

        # the threshold for accepting convergence
        self._thresh = 0.001

    def rho_T(self):
        return pow(self._T + self._tau, -self._kappa)

    def update_params(self, docs):

        # tokenise docs
        (docs_word_ids, docs_word_cts) = process_docs(docs, self._vocab)

        if len(docs_word_ids) != self._S:
            print("batch size not equal to S, overwritting to S=batch size")
            self._S = len(docs_word_ids)

        # initialise the mean-field dist hyperparam gamma for the batch of docs (dirichlet param)
        gamma = rand_hyperparam((self._S, self._K))
        Elogtheta = dirichlet_expectation(gamma)
        expElogtheta = np.exp(Elogtheta)

        # keep track of sufficient statistics for the global update
        sstats = np.zeros(self._lambda.shape)

        # LOCAL UPDATE -------------------------------------------------------
        # for each document, update its gamma and phi
        for d in range(0, self._S):
            # These are shorthands for readibility
            ids = docs_word_ids[d]
            cts = docs_word_cts[d]
            gammad = gamma[d, :]
            Elogthetad = Elogtheta[d, :]
            expElogthetad = expElogtheta[d, :]
            expElogbetad = self._expElogbeta[:, ids]

            # The optimal phi_{dvk} is proportional to
            # expElogthetad_k * expElogbetad_v. phinorm is the normalizer.
            phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100

            # iteratively update gamma and phi until convergence
            for iter in range(0,100):
                prev_gamma = gammad
                # We represent phi implicitly to save memory and time.
                # Substituting the value of the optimal phi back into
                # the update for gamma gives this update. Cf. Lee&Seung 2001.
                gammad = self._alpha + expElogthetad * \
                    np.dot(cts / phinorm, expElogbetad.T)

                Elogthetad = dirichlet_expectation(gammad)
                expElogthetad = np.exp(Elogthetad)
                phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100
                # If gamma hasn't changed much, we're done.
                meanchange = np.mean(abs(gammad - prev_gamma))
                if (meanchange < self._thresh):
                    break
            # update gamma
            gamma[d] = gammad
            # Contribution of document d to the expected sufficient
            # statistics for the M step.
            sstats[:, ids] += np.outer(expElogthetad.T, cts/phinorm)

        # This step finishes computing the sufficient statistics for the
        # M step, so that
        # sstats[k, w] = \sum_d n_{dw} * phi_{dwk}
        # = \sum_d n_{dw} * exp{Elogtheta_{dk} + Elogbeta_{kw}} / phinorm_{dw}.
        sstats = sstats * self._expElogbeta

        # GLOBAL UPDATE ------------------------------------------------------

        # rhot will be between 0 and 1, and says how much to weight
        # the information we got from this mini-batch.
        rho_T = self.rho_T()

        # Update lambda based on documents.
        self._lambda = self._lambda * (1-rho_T) + \
            rho_T * (self._eta + self._D * sstats / self._S)
        self._Elogbeta = dirichlet_expectation(self._lambda)
        self._expElogbeta = np.exp(self._Elogbeta)
        self._T += 1

        return (gamma, self._lambda)





# test_docs = prep_docs(['hi my name is kheeran naidu and i am a tech guy for the naidu company qworky', 'there is alot of tech going on in wit2h wit2h the naidu family especially with qworky'])
# vocab = vocab_to_obj(docs_to_vocab(test_docs))
# print(vocab)
# print(process_docs(test_docs, vocab))
#
# model = OnlineLDA(docs_to_vocab(test_docs), 20, 2, 100, 1, 1, 1, 1, 10)
#
# print(model.rho_T())
