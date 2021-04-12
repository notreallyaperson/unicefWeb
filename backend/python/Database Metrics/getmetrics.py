
import sys
sys.path.append('../')
import library as lib
import requests
import json
import numpy as np
import time
import re


# Get the index of the most recent article
# total_articles = requests.get('http://localhost:5000/api/articles/total')
id = 66550

# Get feed metrics

raw_feeds = requests.get('http://localhost:5000/api/rssfeeds/').text

# externally save the feeds deatils
with open('epochs/feeddetails.txt', 'w') as f:
    f.write("%s\n" % raw_feeds)


# Get metrics from documents
start = time.time()
vocab = []
for epoch in range(60):
    print("Epoch: " + str(epoch + 1) + "/60")

    # Get subsequent 1000 articles
    raw_articles = json.loads(requests.get('http://localhost:5000/api/articles/1000/' + str(id)).text)['articles']
    ids = [ article['_id'] for article in raw_articles]
    titles = [ article['title'] for article in raw_articles]
    contents = [ lib.prep_doc(article['content']) for article in raw_articles]
    feeds = [ article['feedId'] for article in raw_articles]
    dates = [ article['dateParsed'] for article in raw_articles]

    ids2 = []
    titles2 = []
    contents2 = []
    feeds2 = []
    dates2 = []

    for i in range(len(ids)):
        if len(contents[i]) > 2000:
            ids2.append(ids[i])
            titles2.append(titles[i])
            contents2.append(contents[i])
            feeds2.append(feeds[i])
            dates2.append(dates[i])


    # externally save the titles
    with open('epochs/titles-epoch-' + str(epoch) + '.txt', 'w') as f:
        for title in titles2[:500]:
            f.write("%s\n" % re.sub(r'[^A-Za-z ]', ' ', title))

    # externally save the content
    with open('epochs/contents-epoch-' + str(epoch) + '.txt', 'w') as f:
        for content in contents2[:500]:
            f.write("%s\n" % content)

    # externally save the ids
    with open('epochs/ids-epoch-' + str(epoch) + '.txt', 'w') as f:
        for _id in ids2[:500]:
            f.write("%s\n" % _id)

    # externally save the feeds
    with open('epochs/feeds-epoch-' + str(epoch) + '.txt', 'w') as f:
        for feed in feeds2[:500]:
            f.write("%s\n" % feed)

    # externally save the dates
    with open('epochs/dates-epoch-' + str(epoch) + '.txt', 'w') as f:
        for date in dates2[:500]:
            f.write("%s\n" % date)
    
    # update id for next iter
    id = ids[-1] - 1

    print("Elapsed Time: " + str(time.time() - start))
