
import library as lib
import requests
import json
import numpy as np
import time


# Get the index of the most recent article
total_articles = requests.get('http://localhost:5000/api/articles/total')
id = 66550

# Get vocabulary from documents
start = time.time()
vocab = []
stopwords = lib.stopwords()
for epoch in range(60):
    print("Epoch: " + str(epoch + 1) + "/60")

    # Get subsequent 1000 articles
    raw_articles = json.loads(requests.get('http://localhost:5000/api/articles/1000/' + str(id)).text)['articles']
    ids = [ article['_id'] for article in raw_articles]
    titles = [ article['title'] for article in raw_articles]
    contents = [ lib.prep_doc(article['content']) for article in raw_articles]

    # Create vocabulary
    docs = lib.prep_docs(contents)
    for doc in docs:
        lemmas = doc.split()
        for lemma in lemmas:
            if (len(lemma) > 2): # exclude words shorter than 2 characters
                if (not lemma in stopwords): # exclude list of stopwords
                    if(not lemma in vocab):
                        vocab.append(lemma)

    # update id for next iter
    id = ids[-1] - 1

    print("Elapsed Time: " + str(time.time() - start))

# externally save the vocabulary
with open('vocabulary.txt', 'w') as f:
    for word in vocab:
        f.write("%s\n" % word)
