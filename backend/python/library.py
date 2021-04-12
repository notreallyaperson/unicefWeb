'''
This file is for supporting functions to the main online topic modelling algorithm
'''

import nltk, re, newspaper
import numpy as np
from scipy.special import psi, gammaln


# Initialise english word dictionary
eng_words = set(nltk.corpus.wordnet.words())
# eng_words = set(nltk.corpus.words.words())


# Initialise lemmatizer
wordnet_lemmatizer = nltk.stem.WordNetLemmatizer()


# Fix random seed for testing
# np.random.seed(37213)

# Getting article information from url using newspaper package
# function of type string -> string
# error catch returns None when not a valid url
def download_article(url):
    try:
        article = newspaper.Article(url)
        article.download()
        article.parse()
        return article.text
    except:
        raise Exception("Error: Invalid url.")

# Preparing the raw text of a document for the algorithm (removing stopwords and unwanted characters)
# function of type string -> string
def prep_doc(doc):
    prepped_doc = doc.lower()
    # prepped_doc = re.sub(r'(https:\/\/|http:\/\/|www)(www)*[^\s]*', '', prepped_doc) # remove URLs
    prepped_doc = re.sub(r'[^a-z ]', ' ', prepped_doc) # keep only letters and spaces
    prepped_doc = re.sub(r' +', ' ', prepped_doc) # remove multiple spaces

    # Lemmatize the words
    final_doc = []
    for word in prepped_doc.split():
        lemma = wordnet_lemmatizer.lemmatize(word, pos="v")
        final_doc.append(lemma)

    return " ".join(final_doc)

# prepping the corpus of documents
# function of type list of strings -> list of strings
def prep_docs(docs):
    return list(map(prep_doc, docs))


# Define the list of stopwords (from sklearn with mannually added other non-topical words)
# function of type None -> list of strings
def stopwords():
    stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'youre', 'youve', 'youll', 'youd', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'shes', 'her', 'hers', 'herself', 'it', 'its', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'thatll', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'dont', 'should', 'shouldve', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'arent', 'couldn', 'couldnt', 'didn', 'didnt', 'doesn', 'doesnt', 'hadn', 'hadnt', 'hasn', 'hasnt', 'haven', 'havent', 'isn', 'isnt', 'ma', 'mightn', 'mightnt', 'mustn', 'mustnt', 'needn', 'neednt', 'shan', 'shant', 'shouldn', 'shouldnt', 'wasn', 'wasnt', 'weren', 'werent', 'wont', 'wouldn', 'wouldnt', 'would', 'also', 'like', 'however', 'although', 'hence', 'otherwise', 'moreover', 'additionally', 'futhermore', 'even', 'many', 'made', 'much', 'must', 'come', 'need', 'still', 'could', 'though', 'make', 'rather', 'since', 'well', 'back', 'thus', 'then', 'going', 'say', 'one', 'two', 'three', 'year', 'people', 'get', 'use', 'see', 'tell', 'know', 'show', 'per', 'take', 'new', 'think', 'time', 'first', 'day', 'last', 'work', 'include', 'find', 'read', 'week', 'add', 'around', 'may', 'right', 'leave', 'want', 'look', 'email', 'news', 'years', 'give']

    # externally save the stopwords
    with open('stopwords.txt', 'w') as f:
        for word in stopwords:
            f.write("%s\n" % word)

    return stopwords

# A simple function to check if the word is valid in our model
# function of type string, list of strings -> bool
def valid_word(word, stopwords=stopwords()):
    if (len(word) > 2): # exclude words shorter than 2 characters
        if (word in eng_words): # include only english words
            if (not word in stopwords): # exclude list of stopwords
                # if (nltk.corpus.wordnet.synsets(word)[0].pos() != 'v'): # exclude verbs (NOT A GOOD IDEA)
                    return True
    return False

# Creating the vocabulary list from a raw corpus of documents
# function of type list of strings, list of strings -> list of strings
def docs_to_vocab(docs, stopwords=stopwords()):
    docs = prep_docs(docs)
    vocab = []
    for doc in docs:
        lemmas = doc.split()
        for lemma in lemmas:
            if (valid_word(lemma)): 
                if(not lemma in vocab):
                    vocab.append(lemma)

    # externally save the vocabulary
    with open('vocabulary.txt', 'w') as f:
        for word in vocab:
            f.write("%s\n" % word)

    return vocab

# Load the externally saved file (usually the vocabulary)
def load_from_file(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    return [ line[:-1] for line in lines]


# Creating the vocabulary mappings object from the list (tokenisation)
# function of type list of strings, list of strings -> object
def vocab_to_obj(vocab, stopwords=stopwords()):
    vocab_obj = {}
    for word in vocab:
        if (valid_word(word, stopwords)): 
            if (not word in vocab_obj):
                vocab_obj[word] = len(vocab_obj)
    return vocab_obj

# Creating the list of the vocabulary object in the appropriate order
# function of type object -> list of strings
def vocab_obj_to_list(vocab_obj):
    vocab_list = list(vocab_obj.keys())
    for i, key in enumerate(vocab_list):
        if vocab_obj[key] != i:
            print("Incorrect ordering of vocabulary list")
            return []
    return vocab_list


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
        docs_word_ids.append(list(doc_obj.keys()))
        docs_word_cts.append(list(doc_obj.values()))

    return (docs_word_ids, docs_word_cts)

# Get appropriate split of testing docs into observed and held out portions of an article
# function of type list of strings, object -> list of ints, list of ints, list of ints, list of ints
def split_test_docs(docs_test, vocab):
    
    (docs_test_ids, docs_test_cts) = process_docs(docs_test, vocab)
    docs_test_obs_ids = []
    docs_test_obs_cts = []
    docs_test_ho_ids = []
    docs_test_ho_cts = []
    for i in range(len(docs_test_ids)):
        id_shuffle = np.random.permutation(len(docs_test_ids[i]))
        ids = list(np.array(docs_test_ids[i])[id_shuffle])
        cts = list(np.array(docs_test_cts[i])[id_shuffle])
        
        doc_split = int(2*len(ids)/3)
        docs_test_obs_ids.append(ids[:doc_split])
        docs_test_obs_cts.append(ids[:doc_split])
        docs_test_ho_ids.append(ids[doc_split:])
        docs_test_ho_cts.append(ids[doc_split:])
    return (docs_test_obs_ids, docs_test_obs_cts, docs_test_ho_ids, docs_test_ho_cts)

# Produce random dirichlet parameters for the LDA model
# function of type tuple -> numpy array of shape tuple
def rand_dir_hyperparam(shape):
    return np.random.gamma(100., 1./100., shape)


'''
Functions to calculate quantities to measure the typical behaviour of a dirichlet dist
'''

def dirichlet_expectation(dir_params):
    return dir_params/np.sum(dir_params)

def log_dirichlet_expectation(dir_params):
    return(psi(dir_params) - psi(np.sum(dir_params)))

def dirichlet_variance(dir_params):
    mean = dirichlet_expectation(dir_params)
    return mean*(1 - mean)/(1 + np.sum(dir_params))

def dirichlet_entropy(dir_params):
    sum = np.sum(dir_params)
    lnB = np.sum(gammaln(dir_params)) - gammaln(sum)
    return lnB + (sum - len(dir_params))*psi(sum) - np.sum((dir_params - 1)*psi(dir_params))

def dirichlet_KL(dir_paramsA, dir_paramsB):
    if dir_paramsA.shape == dir_paramsB.shape:
        a_0 = np.sum(dir_paramsA)
        b_0 = np.sum(dir_paramsB)
        lnA = gammaln(a_0) - np.sum(gammaln(dir_paramsA))
        lnB = gammaln(b_0) - np.sum(gammaln(dir_paramsB))
        return lnA -lnB + np.sum((dir_paramsA-dir_paramsB)*(psi(dir_paramsA) - psi(a_0)))
    else:
        print("Incorrect dirichlet parameter shape!")
        return 0

class OnlineLDA:
    """
    Class for the online LDA model initialised with the following arguments:
    - vocab: a list of V words as the vocabulary (any other words will be ignored) - list of strings
    - D: the expected size of the entire corpus (i.e. 100,000 docs) - int
    - S: the size of each batch of articles - int
    - K: the number of topics - int
    - T: memory variable to continue previous job from batch T
    - tau: (FIXED) a hyperparam of the optimiser step size to downweight early samples (tau>=0)
    - kappa: (FIXED) a hyperparam of the optimiser step size to alter the learning rate (kappa \in (0.5, 1])
    - alpha: (FIXED) the hyperparam prior for the documents' topic distributions param theta - float
    - eta: (FIXED) the prior for the topics' word distributions param beta (lambda) - list of list of floats or float

    Model from [Hoffman et al 2013].
    """

    def __init__(self, vocab, D, S, K, tau=4096, kappa=0.7, alpha=1, eta=1):
        # super().__init__()

        self._vocab = vocab_to_obj(vocab) #required
        self._D = int(D) #required
        self._S = int(S) #required
        self._K = int(K) #required

        # Validity check
        if (tau >=0):
            self._tau = float(tau)
        else:
            self._tau = float(4096)
            print("tau out of range, overwritting to tau=4096.0")

        # Validity check
        if (0.5 < kappa <= 1):
            self._kappa = float(kappa)
        elif (kappa == 0):
            # print("kappa set for basic VI")
            self._kappa = float(kappa)
        else:
            print("kappa out of range, overwritting to kappa=0.7")
            self._kappa = float(0.7)

        # initialise model parameters
        self._alphaseed = alpha
        self._etaseed = eta
        self._T = int(0)
        self._V = len(self._vocab)
        self._alpha = np.ones((self._S, self._K))*self._alphaseed
        self._eta = np.ones((self._K, self._V))*self._etaseed

        # initialise the mean-field dist hyperparam lambda (dirichlet param)
        self._lambda = rand_dir_hyperparam((self._K, self._V)) #required
        self._Elogbeta = log_dirichlet_expectation(self._lambda)
        self._expElogbeta = np.exp(self._Elogbeta)

        # the threshold for accepting convergence
        self._thresh = 0.01

    def rho_T(self):
        return pow(self._T + 1 + self._tau, -self._kappa)

    def calculate_elbo(self, docs_word_ids, docs_word_cts, gamma):
        elbo = 0
        Elogtheta = log_dirichlet_expectation(gamma)
        expElogtheta = np.exp(Elogtheta)

        # E[log p(docs | z, beta)] + E[log p(z | theta)] - E[log q(z | phi)]
        for d in range(0, self._S):

            # Some useful shorthands
            ids = docs_word_ids[d]
            cts = docs_word_cts[d]
            Elogbetad = self._Elogbeta[:, ids]
            expElogbetad = self._expElogbeta[:, ids]
            Elogthetad = Elogtheta[d, :]
            expElogthetad = expElogtheta[d, :]
            Elogthetad_ext = np.array([Elogthetad,]*expElogbetad.shape[1]).T # needed to extend Elogthetad for a later operation to work efficiently
            expElogthetad_ext = np.array([expElogthetad,]*expElogbetad.shape[1]).T # needed to extend expElogthetad for a later operation to work efficiently
            
            # Calculate phi
            phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100
            phi =  expElogthetad_ext * expElogbetad / phinorm 
            # update elbo
            for i, ct in enumerate(cts):
                temp_var = phi[:, i] * (Elogthetad_ext[:, i] + Elogbetad[:, i] - np.log(phi[:, i])) * ct
                elbo += np.sum(temp_var)

        # E[log p(theta | alpha) - log q(theta | gamma)]
        elbo += np.sum(gammaln(np.sum(self._eta, 1)) - gammaln(np.sum(self._lambda, 1)))
        elbo += np.sum(gammaln(self._lambda) - gammaln(self._eta))
        elbo += np.sum((self._eta - self._lambda)*self._expElogbeta)

        print(elbo)
        return elbo

        # Compensate for the batch subsampling of the corpus of documents
        elbo *= self._D / self._S

        # E[log p(beta | eta) - log q (beta | lambda)]
        elbo += np.sum(gammaln(np.sum(self._alpha, 1)) - gammaln(np.sum(gamma, 1)))
        elbo += np.sum(gammaln(gamma) - gammaln(self._alpha))
        elbo += np.sum((self._alpha - gamma)*Elogtheta)

        return elbo

    def update_params_batch_SVI(self, docs, no_update=False, calc_elbo=False):

        # Validity check
        if len(docs) != self._S and not no_update:
            print("batch size not equal to S, overwritting to S=" + str(len(docs)))
            self._S = len(docs)
            self._alpha = np.ones((self._S, self._K))*self._alphaseed

        # tokenise the documents
        (docs_word_ids, docs_word_cts) = process_docs(docs, self._vocab)

        # Average words per document
        print("avg words per doc:", sum([sum(cts) for cts in docs_word_cts])/len(docs_word_cts))

        # initialise the mean-field dist hyperparam gamma for the batch of docs (dirichlet param)
        gamma = rand_dir_hyperparam((self._S, self._K))
        Elogtheta = log_dirichlet_expectation(gamma)
        expElogtheta = np.exp(Elogtheta)

        # keep track of sufficient statistics for the global update (from David Blei's implementation)
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
            # expElogthetad_k * expElogbetad_v and phinorm is the normalizer term.
            phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100


            # iteratively update gamma and phi until convergence
            for iter in range(0,500):
                prev_gamma = gammad
                # We represent phi implicitly to save memory and time.
                # Substituting the value of the optimal phi back into
                # the update for gamma gives this update. Cf. Lee&Seung 2001.
                gammad = self._alpha[d] + expElogthetad * np.dot(cts / phinorm, expElogbetad.T)

                Elogthetad = log_dirichlet_expectation(gammad)
                expElogthetad = np.exp(Elogthetad)
                phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100
                # If gamma hasn't changed much, we're done.
                meanchange = np.mean(abs(gammad - prev_gamma))
                if (meanchange < self._thresh):
                    break
                if (iter == 499):
                    print("Convergence not reached, exiting with meanchange:", meanchange)


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
        if not no_update:
            self._lambda = self._lambda * (1-rho_T) + \
                rho_T * (self._eta + self._D * sstats / self._S)
            self._Elogbeta = log_dirichlet_expectation(self._lambda)
            self._expElogbeta = np.exp(self._Elogbeta)
            self._T += 1

        # Calculate ELBO after these updates
        if (calc_elbo):
            elbo = self.calculate_elbo(docs_word_ids, docs_word_cts, gamma) 
        else:
            elbo = 0

        return (gamma, self._lambda, elbo)

    # Model Topic Analysis -----------------------------------------------------------

    # --------------------------------------------------------------
    # Calculate log predictive probability (FOR TESTING)
    def log_pred(self, docs_test_obs_ids, docs_test_obs_cts, docs_test_ho_ids, docs_test_ho_cts):
        # ----------------------------------------
        # Setup and initialisation

        # helpful shorthand
        D_t = len(docs_test_obs_ids)
        alpha_t = np.ones((D_t, self._K))*self._alphaseed
        eta_t = np.ones((self._K, self._V))*self._etaseed
            
        # Word topic assignments
        Z_t = np.zeros((D_t,self._V))

        # Initialise incorrectly
        for d in range(D_t):
            for v in range(self._V):
                Z_t[d,v] = -1

        # Random initialisation
        for d, doc in enumerate(docs_test_obs_ids):
            for w in doc:
                Z_t[d,w] = np.random.randint(self._K)

        # Random init document topic proportions
        T_t = np.zeros((D_t, self._K))
        for d in range(D_t):
            T_t[d] = np.random.dirichlet(alpha_t[d])

        # ---------------------------------------------------------
        # Calculate the predictive density

        for extra_iter in range(1):
            # Sample from Beta multinomial dist prametrised by lambda learned
            B = np.zeros((self._K, self._V))
            for i in range(B.shape[0]):
                B[i] = np.random.dirichlet(self._lambda[i])

            # Sample from full conditional of z
            for d, ids in enumerate(docs_test_obs_ids):
                for _id in ids:
                    z_dw = np.exp(np.log(T_t[d]) + np.log(B[:, _id]))
                    z_dw /= np.sum(z_dw)
                    # Resample topic assignment
                    Z_t[d,w] = np.random.multinomial(1, z_dw).argmax()

            # sample from full conditional of theta
            ss_t_t = np.zeros((D_t, self._K))
            for d in range(D_t):
                # Get sufficient statistics for conjugate conditional
                for k in range(self._K):
                    ss_t_t[d][k] = alpha_t[d][k] + np.sum(Z_t[d] == k)

                # Resample topic proportions theta
                T_t[d,:] = np.random.dirichlet(ss_t_t[d])

        log_pred_density = np.zeros((D_t, self._V))
        sum_avg = 0
        for d, doc in enumerate(docs_test_ho_ids):
            for w, _id in enumerate(doc):
                log_pred_density[d,_id] = np.log(np.sum(np.exp(np.log(B[:,_id]) + np.log((alpha_t[d]+ ss_t_t[d])/(self._K+np.sum(ss_t_t[d])))))) * docs_test_ho_cts[d][w]
                sum_avg += docs_test_ho_cts[d][w]
        avg_log_pred = np.sum(log_pred_density)/sum_avg
        print(avg_log_pred)
        return avg_log_pred
    # ---------------------------------------------------------

    def approx_log_pred(self, docs_test_obs_ids, docs_test_obs_cts, docs_test_ho_ids, docs_test_ho_cts):
    
        # helpful shorthand
        docs_word_ids = docs_test_obs_ids
        docs_word_cts = docs_test_obs_cts
        D_t = len(docs_test_obs_ids)
        alpha_t = np.ones((D_t, self._K))*self._alphaseed
        eta_t = np.ones((self._K, self._V))*self._etaseed
        
        # initialise the mean-field dist hyperparam gamma for the test (dirichlet param)
        gamma = rand_dir_hyperparam((D_t, self._K))
        Elogtheta = log_dirichlet_expectation(gamma)
        expElogtheta = np.exp(Elogtheta)

        # UPDATE -------------------------------------------------------
        # for each document, update its gamma and phi
        for d in range(0, D_t):
            # These are shorthands for readibility
            ids = docs_word_ids[d]
            cts = docs_word_cts[d]
            gammad = gamma[d, :]
            Elogthetad = Elogtheta[d, :]
            expElogthetad = expElogtheta[d, :]
            expElogbetad = self._expElogbeta[:, ids]

            # The optimal phi_{dvk} is proportional to
            # expElogthetad_k * expElogbetad_v and phinorm is the normalizer term.
            phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100


            # iteratively update gamma and phi until convergence
            for iter in range(0,500):
                prev_gamma = gammad
                # We represent phi implicitly to save memory and time.
                # Substituting the value of the optimal phi back into
                # the update for gamma gives this update. Cf. Lee&Seung 2001.
                gammad = alpha_t[d] + expElogthetad * np.dot(cts / phinorm, expElogbetad.T)

                Elogthetad = log_dirichlet_expectation(gammad)
                expElogthetad = np.exp(Elogthetad)
                phinorm = np.dot(expElogthetad, expElogbetad) + 1e-100
                # If gamma hasn't changed much, we're done.
                meanchange = np.mean(abs(gammad - prev_gamma))
                if (meanchange < self._thresh):
                    break
                # if (iter == 499):
                #     print("Convergence not reached, exiting with meanchange:", meanchange)

            # update gamma
            gamma[d] = gammad

        # Sample from Beta multinomial dist prametrised by lambda learned
        B = np.zeros((self._K, self._V))
        for i in range(B.shape[0]):
            B[i] = np.random.dirichlet(self._lambda[i])
        
        # Sample the Theta multinomial dist parameterised by the gamma learned
        T = np.zeros((D_t, self._K))
        for i in range(T.shape[0]):
            T[i] = np.random.dirichlet(gamma[i])

        log_pred_density = np.zeros((D_t, self._V))
        sum_avg = 0
        for d, doc in enumerate(docs_test_ho_ids):
            for w, _id in enumerate(doc):
                log_pred_density[d,_id] = np.log(np.sum(np.exp(np.log(B[:,_id]) + np.log(T[d])))) * docs_test_ho_cts[d][w]
                sum_avg += docs_test_ho_cts[d][w]
        avg_log_pred = np.sum(log_pred_density)/sum_avg
        print(avg_log_pred)
        return avg_log_pred

    # Order topic clusters by least sparse word distribution first (showing the most common words)
    def arg_sort_lams(self, length=10):
        return np.flip(np.argsort(np.array(self._lambda).sum(axis=1)))

    # Display the most common words in the topics
    def view_topics(self, indices=[], length=10, no_print=False):
        if (len(indices) == 0):
            indices = range(self._lambda.shape[0])
        word_lams = []
        word_lamsp = []
        for i in range(self._lambda.shape[0]):
            word_lams.append(sorted(zip(self._lambda[i], vocab_obj_to_list(self._vocab)), key=lambda x: x[0], reverse=True)[:length]) 
            word_lamsp.append(sorted(zip(100*dirichlet_expectation(self._lambda[i]), vocab_obj_to_list(self._vocab)), key=lambda x: x[0], reverse=True)[:length]) 
        for i in indices:
            if (not no_print):
                print(i)
                print(word_lams[i])
                print(word_lamsp[i])
                print()
        return word_lams

    # Display ordered topics
    def view_sorted_topics(self, topics=0, length=10):
        if (topics == 0):
            topics = self._K
        ordered_lams = self.arg_sort_lams()[:topics]
        self.view_topics(indices=ordered_lams, length=length)
        return ordered_lams

    # Model Document Analysis -------------------------------------------------------------

    # Order documents by least sparse topic distribution first (showing the top topics)
    def arg_sort_gams(self, gams):
        return np.flip(np.argsort(np.array(gams).sum(axis=1)))

    # Display the most certain and abundent topics in the document 
    def view_documents(self, gams, indices=[], length=10, no_print=False):
        if (len(indices) == 0):
            total = 20 if (gams.shape[0] > 20) else gams.shape[0]
            indices = range(total)
        length = self._K if (self._K < length) else length
        topic_gams = []
        for i in range(gams.shape[0]):
            # topic_gams.append(sorted(zip(gams[i], range(self._K)), key=lambda x: x[0], reverse=True)[:length]) 
            topic_gams.append(sorted(zip(100*dirichlet_expectation(gams[i]), range(self._K)), key=lambda x: x[0], reverse=True)[:length])
        for i in indices:
            if (not no_print):
                print(i)
                print(topic_gams[i])
                print()
        return topic_gams

    # Display ordered topics
    def view_sorted_documents(self, gams, indices=[], documents=0, length=10, no_print=False):
        if (documents == 0):
            documents = 50 if (gams.shape[0] > 50) else gams.shape[0]
        ordered_gams = self.arg_sort_gams(gams)[:documents] if (len(indices) == 0) else indices
        self.view_documents(gams, indices=ordered_gams, length=length, no_print=no_print)
        return ordered_gams



# Create reduced class for standard (offline) LDA
class BasicLDA(OnlineLDA):
    """
    A reduction of the OnlineLDA class to the standard (offline) LDA initialised with:
    - vocab: a list of V words as the vocabulary (any other words will be ignored) - list of strings
    - D: the expected size of the entire corpus (i.e. 100,000 docs) - int
    - K: the number of topics - int
    - alpha: the hyperparam prior for the documents' topic distributions param theta - float
    - eta: the prior for the topics' word distributions param beta (lambda) - list of list of floats or float

    Model from [Hoffman et al 2013].
    """

    def __init__(self, vocab, D, K, alpha=1, eta=1):
        super().__init__(vocab, D, D, K, 1,0, alpha, eta)


    def update_params_VI(self, docs, no_update=False):

        # VB iterate until convergence
        while True:
            prev_lam = self._lambda
            (gam, lam) = self.update_params_batch_SVI(docs, no_update=no_update)
            meanchange = np.mean(abs(lam - prev_lam))
            if (meanchange < self._thresh):
                break

        return (gam, lam)