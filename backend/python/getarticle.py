import library as lib
import requests
import json
import numpy as np
import time
import re

total_docs = 0
content_length = 0
for epoch in range(60):
    ids = lib.load_from_file('epochs/archive/ids-epoch-' + str(epoch) + '.txt')
    titles = lib.load_from_file('epochs/archive/titles-epoch-' + str(epoch) + '.txt')
    contents = lib.load_from_file('epochs/archive/contents-epoch-' + str(epoch) + '.txt')
    ids2 = []
    titles2 = []
    contents2 = []

    for i in range(len(ids)):
        if len(contents[i]) > 2000:
            ids2.append(ids[i])
            titles2.append(titles[i])
            contents2.append(contents[i])
    
    # print(max([len(content) for content in contents]))
    selection = contents2[500:]
    content_length += sum([len(content) for content in selection])
    total_docs += len(selection)
    print(len(selection))

    # # externally save the titles
    # with open('epochs/testing_titles-epoch-' + str(epoch) + '.txt', 'w') as f:
    #     for title in titles2[500:]:
    #         f.write("%s\n" % re.sub(r'[^A-Za-z ]', ' ', title))

    # # externally save the content
    # with open('epochs/testing_contents-epoch-' + str(epoch) + '.txt', 'w') as f:
    #     for content in contents2[500:]:
    #         f.write("%s\n" % content)

    # # externally save the ids
    # with open('epochs/testing_ids-epoch-' + str(epoch) + '.txt', 'w') as f:
    #     for _id in ids2[500:]:
    #         f.write("%s\n" % _id)

print("avg content length:", int(content_length/total_docs), "chars")

# # Get the index of the most recent article
# total_articles = requests.get('http://localhost:5000/api/articles/total')
# id = 66550
# print(id)

# # Get articles and perform batch learning
# start = time.time()
# for epoch in range(1):
#     print("Epoch: " + str(epoch + 1) + "/60")

#     # Get subsequent 1000 articles
#     raw_articles = json.loads(requests.get('http://localhost:5000/api/articles/1000/' + str(id)).text)['articles']
#     ids = [ article['_id'] for article in raw_articles]
#     titles = [ article['title'] for article in raw_articles]
#     contents = [ lib.prep_doc(article['content']) for article in raw_articles]

#     # Display wanted articles
#     indices = [ 16, 116,  36,  37, 978, 768,  66, 841, 814, 831]
#     for i in indices:
#         print('Title:', titles[i] )
#         # print('Content:', contents[i])
#         print()


#     # update id for next iter
#     id = ids[-1] - 1

#     print("Elapsed Time: " + str(time.time() - start))
#     print(id)
    
#     # externally save the titles
#     with open('titles-epoch-' + str(epoch) + '.txt', 'w') as f:
#         for title in titles:
#             f.write("%s\n" % re.sub(r'[^A-Za-z ]', ' ', title))

#     # externally save the content
#     with open('contents-epoch-' + str(epoch) + '.txt', 'w') as f:
#         for content in contents:
#             f.write("%s\n" % re.sub(r'[^A-Za-z ]', ' ', content))
