
import library as lib
import numpy as np

# np.set_printoptions(precision=0)
np.set_printoptions(suppress=True)
np.set_printoptions(linewidth=180)


# k = np.sum(lam, axis=1).argmax()
# print(lam)
# print(lib.dirichlet_expectation(lam))
# print(lib.dirichlet_variance(lam))
# print(lib.dirichlet_entropy(lam))

epoch = 0
total_num_epochs = 60
attempt = 5
num_topics = 50

def shuffle(list_array, order):
    return list(np.array(list_array)[order])

# Setting up the parameters for analysis
orderA = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptA-order-' + str(num_topics) + '-epoch-' + str(epoch) +'.npy')
vocab = lib.load_from_file('vocab/badwords.txt')
titles = shuffle(lib.load_from_file('epochs/titles-epoch-' + str(epoch) + '.txt'), orderA)
contents = shuffle(lib.load_from_file('epochs/contents-epoch-' + str(epoch) + '.txt'), orderA)
lamA = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptA-lam-' + str(num_topics) + '.npy') 
gamA = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptA-gam-' + str(num_topics) + '-epoch-' + str(epoch) +'.npy')
# lamB = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptB-lam-' + str(num_topics) + '.npy')
# gamB = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptB-gam-' + str(num_topics) + '-epoch-' + str(epoch) +'.npy')
K = lamA.shape[0]
batch_size = gamA.shape[0]
# batch_size = 500

# Initialising the model
modelA = lib.OnlineLDA(vocab, batch_size*total_num_epochs, batch_size,  K)
modelA._lambda = lamA
# modelB = lib.OnlineLDA(vocab, batch_size*total_num_epochs, batch_size,  K)
# modelB._lambda = lamB

# Display
print(len(modelA._vocab))
print(len(lamA[0]))
ordered_lamA = modelA.view_sorted_topics(topics=10, length=50)
# pause()
ordered_gamA = modelA.view_sorted_documents(gamA, documents=100, no_print=True)

# topic_gams = []
# topic_gams_actual = []
# for i in range(gamA.shape[0]):
#     # topic_gams.append(sorted(zip(gams[i], range(self._K)), key=lambda x: x[0], reverse=True)[:length]) 
#     topic_gams.append(sorted(zip(100*lib.dirichlet_expectation(gamA[i]), range(K)), key=lambda x: x[0], reverse=True)[:20])
#     topic_gams_actual.append(sorted(zip(gamA[i], range(K)), key=lambda x: x[0], reverse=True)[:20])
# for i in ordered_gamA:
#     if (topic_gams[i][0][1] == 4):
#         print(i)
#         print(topic_gams[i])
#         print()

# # Put words
# word_lams = []
# for i in range(modelA._lambda.shape[0]):
#     word_lams.append(sorted(zip(modelA._lambda[i], lib.vocab_obj_to_list(modelA._vocab)), key=lambda x: x[0], reverse=True))
# new_vocab = []
# for word_acc in word_lams[11]:
#     accuracy = word_acc[0]
#     word = word_acc[1]
#     if accuracy > 1000:
#         new_vocab.append(word)
# print(len(new_vocab))

# # externally save the new vocab
# with open('new_vocabulary.txt', 'w') as f:
#     for word in new_vocab:
#         f.write("%s\n" % word)


KL_D = np.zeros((gamA.shape[0], gamA.shape[0]))

# Load gams from all epochs
alltitles = shuffle(lib.load_from_file('epochs/titles-epoch-' + str(0) + '.txt'), orderA)
allcontents = shuffle(lib.load_from_file('epochs/contents-epoch-' + str(0) + '.txt'), orderA)
allgams = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptA-gam-' + str(num_topics) + '-epoch-' + str(0) +'.npy')

for i in range(1, 60):
    temporderA = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptA-order-' + str(num_topics) + '-epoch-' + str(i) +'.npy')
    temptitles = shuffle(lib.load_from_file('epochs/titles-epoch-' + str(i) + '.txt'), temporderA)
    tempcontents = shuffle(lib.load_from_file('epochs/contents-epoch-' + str(i) + '.txt'), temporderA)
    tempgam = np.load('epochs/Attempt (' + str(num_topics) + 'T)_' + str(attempt) + '/AttemptA-gam-' + str(num_topics) + '-epoch-' + str(i) +'.npy')
    alltitles += temptitles
    allcontents += tempcontents
    allgams = np.concatenate((allgams, tempgam), axis=0)

print(allgams.shape)
topic_allgams = []
topic_allgams_actual = []
for i in range(allgams.shape[0]):
    topic_allgams.append(sorted(zip(100*lib.dirichlet_expectation(allgams[i]), range(K)), key=lambda x: x[0], reverse=True)[:20])
    topic_allgams_actual.append(sorted(zip(allgams[i], range(K)), key=lambda x: x[0], reverse=True)[:20])

similar = np.zeros((allgams.shape[0]))

# i = 156
i = 26
# i = 151
# i = 364
# i = 147
i = 45
i = 433
# i = 470
# i = 51
# i = 268
i = 216 # epoch 0: russian article
# i = 295 # Covid in the UK
# i = 63 # sex trafficking
i = 201 # epoch 0 Capitol (works very well with T500)
# i = 496
# i = 240 
i = list(orderA).index(i)

# i = 484

i_s = [216, 295, 201]

i_s = [ list(orderA).index(i) for i in i_s]

# i_s.append(13821)
i_s.append(18716)

for i in i_s:
        
    print('-----------------------------------------------------------------------------------------')


    for j in range(similar.shape[0]):
        similar[j] = lib.dirichlet_KL(allgams[i], allgams[j]) + lib.dirichlet_KL(allgams[j], allgams[i])


    ordered_similar = np.argsort(similar)[:10]
    print(ordered_similar)
    print(similar[ordered_similar])



    for i in ordered_similar:
        # print(i)
        # print("Similarity:", similar[i])
        # print(topic_allgams[i])
        # print(topic_allgams_actual[i])
        print(alltitles[i])
        # print(len(allcontents[i]))
        # print(contents[i])
        print()

# KL_D = np.zeros((20, 20))
# for i in range(KL_D.shape[0]):
#     for j in range(i, KL_D.shape[1]):
#         KL_D[i, j] = lib.dirichlet_KL(gam[i], gam[j]) + lib.dirichlet_KL(gam[j], gam[i])


# print(KL_D)



# for i in [454, 687, 665, 265, 197, 677, 335, 345, 977, 63, 64]:
#     print(i)
#     print(titles[i])
#     print(contents[i])
#     print()
