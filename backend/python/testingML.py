import library as lib
import requests
import json
import numpy as np
import matplotlib.pyplot as plt
import time
import re
import os
from pathlib import Path

def main(args_obj):

    # Get directory to add data to
    attempt = 0
    while attempt < 1000:
        log_dir = Path('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt))
        if not log_dir.exists():
            break
        attempt += 1
    log_dir = str(log_dir)
    os.mkdir(log_dir)

    # Calc no of epochs
    epochs = int(args_obj['sizeOfCorpus'] / args_obj['sizeOfBatch'])


    # Get the index of the most recent article
    # total_articles = requests.get('http://localhost:5000/api/articles/total')

    # # Initialise the Online LDA model
    modelA = lib.OnlineLDA(args_obj['vocabulary'], args_obj['sizeOfCorpus'], args_obj['sizeOfBatch'],  args_obj['numberOfTopics'], args_obj['tau'], args_obj['kappa'], args_obj['alpha'], args_obj['eta'])
    # modelB = lib.OnlineLDA(args_obj['vocabulary'], args_obj['sizeOfCorpus'], args_obj['sizeOfBatch'],  args_obj['numberOfTopics'])

    # Initialise the Vanilla LDA model
    # modelA = lib.BasicLDA(args_obj['vocabulary'], args_obj['sizeOfCorpus'], args_obj['numberOfTopics'])
    # modelB = lib.BasicLDA(args_obj['vocabulary'], args_obj['sizeOfCorpus'], args_obj['numberOfTopics'])

    # Keep track of elbo progression
    elbosA = []

    # Setup plotting grid
    fig, ax = plt.subplots()


    # Get articles and perform batch learning
    start = time.time()
    for round in range(2):
        # id = 66550
        print('-----------------------------------------------------------------------------------------')
        print("                                         ROUND %s                                         " % str(round + 1))
        print('-----------------------------------------------------------------------------------------')

        # Prepare testing docs
        testing_contents = []
        for epoch in range(epochs):
            testing_contents += lib.load_from_file('epochs/testing_contents-epoch-' + str(epoch) + '.txt')[:2]
        (docs_test_obs_ids, docs_test_obs_cts, docs_test_ho_ids, docs_test_ho_cts) = lib.split_test_docs(testing_contents, modelA._vocab)

        for epoch in range(epochs):
            # if (epoch % 5 == 4):
            print("Epoch: " + str(epoch + 1) + "/" + str(epochs))

            # Get subsequent 1000 articles
            # raw_articles = json.loads(requests.get('http://localhost:5000/api/articles/1000/' + str(id)).text)['articles']
            # ids = [ article['_id'] for article in raw_articles]
            # titles = [ article['title'] for article in raw_articles]
            # contents = [ lib.prep_doc(article['content']) for article in raw_articles]
            ids = lib.load_from_file('epochs/ids-epoch-' + str(epoch) + '.txt')
            titles = lib.load_from_file('epochs/titles-epoch-' + str(epoch) + '.txt')
            contents = lib.load_from_file('epochs/contents-epoch-' + str(epoch) + '.txt')

            # randomise order of the articles
            if (round == 0):
                orderA = np.random.permutation(len(contents))
                np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-order-' + str(args_obj['numberOfTopics']) + '-epoch-' + str(epoch) +'.npy', orderA)
            else:
                orderA = np.load('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-order-' + str(args_obj['numberOfTopics']) + '-epoch-' + str(epoch) +'.npy')

            # Randomly shuffle order
            contents = list(np.array(contents)[orderA])

            # # Run VI
            # gamA, lamA = modelA.update_params_VI(contents)
            # gamB, lamB = modelA.update_params_VI(contents)

            # # Externally save document params
            # np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-gam-' + str(args_obj['numberOfTopics']) + '-epoch-' + str(epoch) +'.npy', gamA)
            # np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptB-gam-' + str(args_obj['numberOfTopics']) + '-epoch-' + str(epoch) +'.npy', gamB)

            # # Externally save topic params
            # np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-lam-' + str(args_obj['numberOfTopics']) + '.npy', modelA._lambda)
            # np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptB-lam-' + str(args_obj['numberOfTopics']) + '.npy', modelB._lambda)


            # Run SVI
            if (round == 0):
                # Run SVI
                gamA, lamA, elboA = modelA.update_params_batch_SVI(contents, calc_elbo=False)
                # gamB, lamB = modelA.update_params_batch_SVI(contents)

                # Keep track of elbo
                elbosA.append(modelA.approx_log_pred(docs_test_obs_ids, docs_test_obs_cts, docs_test_ho_ids, docs_test_ho_cts))
                # elbosA.append(elboA)

                # Externally save topic params
                np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-lam-' + str(args_obj['numberOfTopics']) + '.npy', modelA._lambda)
                # np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptB-lam-' + str(args_obj['numberOfTopics']) + '.npy', modelB._lambda)
            elif (round == 1):
                # Get topic assignments using the current lambda (no update)
                gamA, lamA, elboA = modelA.update_params_batch_SVI(contents, no_update=True, calc_elbo=False)
                # gamB, lamB = modelA.update_params_batch_SVI(contents, no_update=True)

            # Externally save document params
            np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-gam-' + str(args_obj['numberOfTopics']) + '-epoch-' + str(epoch) +'.npy', gamA)
            # np.save('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptB-gam-' + str(args_obj['numberOfTopics']) + '-epoch-' + str(epoch) +'.npy', gamB)


            # if (round == 0):
            #     # externally save the titles
            #     with open('epochs/titles-epoch-' + str(epoch) + '.txt', 'w') as f:
            #         for title in titles:
            #             f.write("%s\n" % re.sub(r'[^A-Za-z ]', ' ', title))

            #     # externally save the content
            #     with open('epochs/contents-epoch-' + str(epoch) + '.txt', 'w') as f:
            #         for content in contents:
            #             f.write("%s\n" % content)

            #     # externally save the ids
            #     with open('epochs/ids-epoch-' + str(epoch) + '.txt', 'w') as f:
            #         for _id in ids:
            #             f.write("%s\n" % _id)

            # update id for next iter
            # id = ids[-1] - 1

            if (round == 0 and epoch > 0):
                # Reset grid
                ax.cla()
                # ax.set(xlabel='epoch', ylabel='elbo', title="K=%s tau=%s kappa=%s alpha=%s eta=%s" % (str(args_obj['numberOfTopics']), str(args_obj['tau']), str(args_obj['kappa']), str(args_obj['alpha']), str(args_obj['eta']) ) )
                ax.set(xlabel='epoch', ylabel='log pred', title="K=%s tau=%s kappa=%s alpha=%s eta=%s" % (str(args_obj['numberOfTopics']), str(args_obj['tau']), str(args_obj['kappa']), str(args_obj['alpha']), str(args_obj['eta']) ) )
                ax.grid()

                # Plot elbo
                x = range(len(elbosA))
                y = elbosA
                ax.plot(x, y)

                # trendline
                z = np.polyfit(x, y, 1)
                p = np.poly1d(z)
                ax.plot(p(x), "r--")

                # externally save figure
                fig.savefig('epochs/Attempt (' + str(args_obj['numberOfTopics']) + 'T)_' + str(attempt) + '/AttemptA-elbo_logpred-' + str(args_obj['numberOfTopics']) + '.png')
                # plt.show()

            print("Elapsed Time: " + str(time.time() - start))

# Programme ------------------------------------------------------------------------------



epochs = 60
batch_size = 500
num_topics_sizes = [50, 100]
alphas = [1, 5, 10]
etas = [1, 0.5, 0.01]

for eta in etas:
    for alpha in alphas:
        for num_topics in num_topics_sizes:
            args_obj = {
                    'vocabulary' : lib.load_from_file('vocab/badwords.txt'),
                    'sizeOfCorpus' : epochs*batch_size,
                    'sizeOfBatch' : batch_size,
                    'numberOfTopics': num_topics,
                    'tau': 4096,
                    'kappa': 1,
                    'alpha': alpha, # doc-topic
                    'eta': eta  # topic-word
                }

            print('-----------------------------------------------------------------------------------------')
            print("no. of topics:", num_topics)
            print("alpha:", alpha)
            print("eta:", eta)

            main(args_obj)
