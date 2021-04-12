---------------
# UNICEF Innovation Fund 2021  
#### Video Pitch: [Round 1](https://www.youtube.com/watch?v=Jvpj3bxbZJA&list=PLLDZif6o0EQ5JQ2XgrGYL-LURhbZ6YzWe&index=1) & [Round 2](https://www.youtube.com/watch?v=DpeucqedO5I&list=PLLDZif6o0EQ5JQ2XgrGYL-LURhbZ6YzWe&index=2)
----------------

#### The Need:
We want to create a safe space online for young people and encourage the safer consumption of news online, since there are lots of biases, misinformation, and negativity in the media which could be damaging for young people. According to various studies, more than 80% of people aged 18-24 are getting their news online, and the internet is their first stop when it comes to finding answers. 

We want to promote more of this, because knowing about the world gives you a better understanding of it and makes you a better citizen. We aim to do this in a constructive way which promotes a healthy relationship between children and the media in a way which prevents them feeling overwhelmed by the negative and occasionally incorrect information.


#### The Solution:
We want to bring online safety through different aspects of our proposed online news platform:

- gathering articles from various legitimate news websites, we provide one easily accessible place from which children and young people can read the news. They don't need to go on different websites to have a satisfying range of information;
- we will offer 2 additional extensions to our platform: a “safe space” version (which filters out potentially harmful content), and a “trigger warning” version (which informs the user about the type of info. they are about to read). Informing them about what they are about to read would prepare them to deal with it better than if it was brutally thrown at them;
- in the long run, use a user's data to accompany them in their online journey. For instance, if a user has been reading a lot of dark news, we could share a happy message to make them smile via our chatbot, or perhaps even suggest visiting another online platform which could help them if needed.

#### The Value:

Reduced search cost in finding news articles to read. Less time is spent scouring different news sites searching for similar articles as it places all the content in a single place for the users. Organises the articles into an unsupervised categorisation which helps the readers get a better picture of what is being said about a topic. Provides transparency to why and how that articles are being categorised and why they are determined to be similar. 

This allows us to filter and provide warnings for potentially harmful content which overall creates a safer, organised and transparent platform for children to access the news.

This technology will significantly improve the journey of children getting the news and promotes a healthier and more diverse set of information. Therefore, parents can comfortably allow their children to access current affairs.


#### The Technologies:
*(Data Science & Machine Learning)*

We are using a data-driven learning technique to understand the topical information of an extremely large corpus of unlabelled articles or documents. The [Latent Dirichlet Allocation](README_contents/LDA-model.pdf) (LDA) model is an unsupervised learning model that outputs the topic proportions of each document based on the likelihood that a word of the document belongs to a particular topic. With more data the model learns the assignment of the topics better. Unfortunately, with most learning methods the time to train a model increases exponentially with the size of the corpus. However, in 2013 Hoffman et al developed a scalable learning method for the model which we implement in the context of online safety.

Combining this with [RSS feed](https://rss.com/) technology, we have developed a way to automate the collection of huge numbers of articles and learn the documents’ topics in an efficient and scalable manner without the need for human intervention.

These topical assignments of the articles allow us to find articles which talk about similar things and also find articles which are extremely different from one another without ever having to read the article. Applying this to the context of safety on the internet, based solely on the words used in an article, we can classify potentially dangerous articles for a younger readership.

An added benefit of the LDA model is that the results are fully interpretable. For instance, we can easily understand why the machine learning algorithm has flagged a particular article as dangerous. This is something that is lacking in most deep learning implementations of natural language processing. This allows us to understand fully the behaviour of the algorithm and, if need be, review any of the topical assignments made - allowing us to analyse and improve the algorithm as we progress.

#### The Results of Prototyping:

*Initial Prototyping:*

Written a masters thesis on the concept. Have researched the theoretical applications thoroughly. From the concept have created a Proof of Concept where we have tested out the algorithm which shows promising results. The next step is to retrieve a larger data set to improve the models accuracy even further.

The current implementation shows practical proof of the theorised scalable learning method. The accuracy of the topical classification also proves to be comparable to currently used methods (Gibbs Sampling and Coordinate Ascent Variational Inference) - where the shear increase in volume of articles combats the potential loss in accuracy from the scalable method. Here are the results using a corpus of 2000+ articles for [3 topics](README_contents/k3.png), [10 topics](README_contents/k10.png) and [50 topics](README_contents/k50.png).

We are constantly running tests to understand our model and results better. The current topical classifications of our results on 2 datasets (approx 800 and 2000 words) work at distinguishing some more general topics present, but we expect that these results will significantly improve by the time the dataset grows to the tens of thousands.

In gathering the data, we have recently had great technical improvements with a fully automated adding of recent articles to the database (currently limited by our compute power and storage capacity) which will improve our testing capabilities in the near future.

*Latest Prototyping:*

The fully automated article retrieval system has stored over 70,000 articles from various websites with freely available content. This batch job runs around 4 times per week and collects the most recent articles published.

The latest testing has been done on a subset of 30,000 articles from [various sources](README_contents/feeds_legend.txt) collected between January and April 2021. Note that the distribution over [time](README_contents/dates.png) and [source](README_contents/feeds.png) biases the results of the prototyping.

The vocabulary used for training is divided into [good](http://crr.ugent.be/) and [bad](https://www.kaggle.com/nicapotato/bad-bad-words) words. The recent testing used only the set of 'good' words, however, the subsequent testing will use the 'bad' words incorporated by giving the algorithm the prior knowledge of a topic containing the 'bad' words.

The algorithm was trained with the prior assumption of the corpus containing 20, 50, 100 & 200 hidden topics. The log predictive likelihood of the test data was used to assess the effectiveness of the algorithm. The results showed that training on [20 topics](README_contents/AttemptA-elbo_logpred-20.png) or [200 topics](README_contents/AttemptA-elbo_logpred-200.png) almost always led to overfitting the test data. Proceeding with [50 topics](README_contents/AttemptA-elbo_logpred-50.png) or [100 topics](README_contents/AttemptA-elbo_logpred-100.png) very often led to an effective algorithm with 50 topics having the slightly higher accuracy.

Currently, the categories found are a compound of topics and are best represented by showing [sets of similar articles](README_contents/categories.txt). For example, using an article related to COVID in the UK, the algorithm is able to find the set of articles which are most similar to it, thus finding the category of articles which make a topic surrounding COVID in the UK. 

This initial prototyping provides significant emperical evidence for the effectiveness of this algorithm which comes with many benefits: 
1. it is scalable and can efficiently process hundreds of thousands of articles using a standard laptop with an intel i7 core;
2. its classification of articles is completely transparent and is fully interpretable by probability distributions and its [graphical model](README_contents/LDA-Graphical-Model.png) (refer to [LDA](README_contents/LDA-model.pdf) for more details);
3. the environmental costs are low as the algorithm trains in under 30 mins for 30,000 articles and doesn't require hours or even days to get good results (compared to deep neural networks).


#### The Milestones for 12 Months:

1. Improve machine learning algorithm to get large and more accurate category sets
2. UI/UX to improve accessibility and encourage use
3. Create frontend website
4. Add trigger warning capabilities to potentially harmful content
5. Create safe space mode to remove all potentially harmful content
6. Create feature to prompt users when accessing large quantities of potentially harmful content


 #### The Team:

***Name:*** Avinash Naidu  
***Gender:*** Male  
***Bio:*** Studied Business Maths and Statistics. Moved on to work in telecommunications under their IT transformation team before starting Qworky, a digital solutions provider in malaysia.  
***Role in the Team:*** CEO, Solution architect and Full stack developer. Will be responsible for overseeing the project direction and assisting in the development of the app  
***Nationality:*** Malaysian

***Name:*** Louise Milhomme  
***Gender:*** Female  
***Bio:*** Studied law in France, and now completing the curriculum at IXAD school, to become a lawyer. Worked on many occasions with kids : as a summer camp counselor, as a teacher, as a volunteer in schools on several projects.   
***Role in the Team:*** UI/UX and market Research.  
***Nationality:*** French

***Name:*** Tamara Anjani  
***Gender:*** Female  
***Bio:*** I am a third year Economics & Management student at University of Bristol. I’m a social media manager for The Pangean, an online magazine where I increase outreach and capture audiences through social media. Being very interested in journalism, I’ve also taken on a role as a podcast writer for PPI UK. A passion in humanitarian and environmental work will also allow me to manage the business through an ethical lens. Finally, my experience in consulting can offer valuable insight into business operations ensuring the project runs efficiently and successfully.  
***Role in the Team:*** Project and Business Manager  
***Nationality:*** Indonesian  

***Name:*** Kheeran Naidu  
***Gender:*** Male  
***Bio:*** I’m pursuing a PhD in Theoretical Computer Science under the Algorithms Research Group at the University of Bristol. I founded The Pangean, an online magazine, 2 years ago to tackle the lack of availability of well-written and thoroughly researched articles (without a paywall) for young adults and students from the ages of 18-35. I’m passionate about playing the guitar and learning new things.  
***Role in the Team:*** CTO, Algorithms and Machine Learning Expert.  
***Nationality:*** Malaysian

------------------------
## Topic Modelling (Latent Dirichlet Allocation)

This project relies on the use of an unsupervised learning task, known as Topic Modelling. In particular, we use the LDA model coupled with the findings in [Hoffman et al 2013] to extend it to massive datasets.

Topic modelling has the goal of grouping words of the same topic without the need for pre-labelling data. his means that massive datasets can be easily prepared for topic modelling.  This has the caveat that,  once words are grouped,  the label of the group (topic) needs to be manually assigned; most of the time, this is fairly straightforward.

The nuances of language and required detailed knowledge of an article's context make the task of grouping topically similar words an extremely difficult one, even for human intelligence. Instead, Topic Modelling tries to learn these groupings through a statistical modelling of the textual information of the articles in a corpus.

[Latent Dirichlet Allocation](README_contents/LDA-model.pdf) (LDA) is one such topic model.  The overall assumptions of the model are that for a fixed vocabulary and pre-determined number of topics, each topic asserts a different distribution of words over the vocabulary. For example, words like law, legal and legislation are more probable under the topic corresponding to politics than they are under the topic corresponding to economics.  This is not to say that it is impossible for the word ‘legislation’ to be drawn from a topic assignment corresponding to economics, it is just very improbable.  Furthermore, the model assumes that within the corpus, each word of each document has some topic assignment which follows the proportion of topics assigned to the document; therefore, if a document is made up of three topics with equal proportions, the topic assignment of the words that make up the document would reflect that.

For K topics, a vocabulary of size V and a corpus with D documents/articles, the LDA model has the following [graphical model representation](README_contents/LDA-Graphical-Model.png) where its assumptions are best given by its corresponding [generative model](README_contents/LDA-Generative-Model.png).

---------------
### References

Hoffman, M.D., Blei, D.M., Wang, C. and Paisley, J., 2013. Stochastic variational inference. The Journal of Machine Learning Research, 14(1), pp.1303-1347.

[Blei Lab](https://github.com/blei-lab)