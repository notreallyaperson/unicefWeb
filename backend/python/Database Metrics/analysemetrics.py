
import sys
sys.path.append('../')
import library as lib
import numpy as np
import time
import json
import matplotlib.pyplot as plt
import re



ids = lib.load_from_file('epochs/ids-epoch-' + str(0) + '.txt')
titles = lib.load_from_file('epochs/titles-epoch-' + str(0) + '.txt')
contents = lib.load_from_file('epochs/contents-epoch-' + str(0) + '.txt')
feeds = lib.load_from_file('epochs/feeds-epoch-' + str(0) + '.txt')
dates = lib.load_from_file('epochs/dates-epoch-' + str(0) + '.txt')

feed_details = json.loads(lib.load_from_file('epochs/feeddetails.txt')[0])

def get_details(_id):
    for feed in feed_details:
        if feed['_id'] == _id:
            return re.sub(r'\?.*', '' ,feed['siteUrl'])
            # return feed['title']

def month(date):
    return date[:7]

for epoch in range(1, 60):
    ids += lib.load_from_file('epochs/ids-epoch-' + str(epoch) + '.txt')
    titles += lib.load_from_file('epochs/titles-epoch-' + str(epoch) + '.txt')
    contents += lib.load_from_file('epochs/contents-epoch-' + str(epoch) + '.txt')
    feeds += lib.load_from_file('epochs/feeds-epoch-' + str(epoch) + '.txt')
    dates += lib.load_from_file('epochs/dates-epoch-' + str(epoch) + '.txt')


def plot_dates():
    prev = 0
    x = []
    y = []
    for date in dates:
        if month(date) == prev:
            y[-1] += 1
        else:
            prev = month(date)
            x.append(prev)
            y.append(0)
    x.reverse()
    y.reverse()

    plt.bar(x, y)
    plt.xlabel('month')
    plt.ylabel('no. of articles')
    plt.title('articles used for training')
    plt.savefig('dates.png')
    plt.clf()

def plot_feeds():
    feed_count = {}
    for feed in feeds:
        if get_details(feed) in feed_count:
            feed_count[get_details(feed)] += 1
        else:
            feed_count[get_details(feed)] = 1

    x = []
    y = []
    legend = []
    alphabet = list(map(chr, range(97, 123))) + ['aa']
    for i, key in enumerate(feed_count.keys()):
        x.append(alphabet[i])
        y.append(feed_count[key])
        legend.append(alphabet[i] + ' -> ' + key)


    # externally save the legend
    with open('feeds_legend.txt', 'w') as f:
        for item in legend:
            f.write("%s\n" % item)

    plt.bar(x, y)
    plt.title('articles used for training')
    plt.ylabel('no of articles')
    plt.xlabel('news site (key)')
    plt.savefig('feeds.png')
    plt.clf()

plot_dates()
plot_feeds()