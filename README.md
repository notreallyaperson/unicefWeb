---------------
# UNICEF Project
----------------

#### The Need:
Our solution is addressing the need for a safe online place for younger people, when it comes to getting their news. Nowadays, more and more people are getting their news online. Based on different studies, within the age group of 18 to 24 years old, more than 80% are getting their news online. We currently can’t find specific data about minors. But knowing that most kids get their first mobile phone by the age of 10/11 years old, it is most likely for them to go first to the internet to find answers to their questions, when it comes to what is going on in the world.
We want to promote reading the news online, because knowing about the world gives you a better understanding of it, and makes you a better citizen. But we want to provide a safe place for that.

#### The Solution:
Our idea is to promote the reading of online news for younger people : from 13 years old and above. We want to bring safety through different aspects.
Firstly by gathering in one place different articles from legitimate news websites, reducing the risk of fake news, and promoting the reading of news online by making it easier. They don’t need to go on different websites anymore to have a satisfying range of information, it’s safer, it’s faster, it’s nicer !

Then, the safety aspect comes again through the organisation of the articles. Indeed, articles will be categorised based on their topics. From that point, we plan to develop a safe space version (filtering out potentially harmful content) and a trigger warnings version, in which we can inform the user about the type of information he/she is going to read about. Being aware of what is coming your way makes you able to deal with it in a better way than if it was brutally thrown at you.

In the long run, we are thinking about using the collected data in order to accompany the user in its journey. For instance, if we find out that a user has been reading a lot of dark news, we could then share a happy little message to make him/her smile (via a chatbot), or even suggest the visit of a proper online platform which can help the user if needed. We look forward to exploring the various possibilities.

#### The Technologies:
*(Data Science & Machine Learning)*

We are using a data-driven learning technique to understand the topical information of an extremely large corpus of unlabelled articles or documents. The Latent Dirichlet Allocation (LDA) model is an unsupervised learning model that outputs the topic proportions of each document based on the likelihood that a word of the document belongs to a particular topic. With more data the model learns the assignment of the topics better. Unfortunately, with most learning methods the time to train a model increases exponentially with the size of the corpus. However, in 2013 Hoffman et al developed a scalable learning method for the model which we implement in the context of online safety.

Combining this with RSS feed technology, we have developed a way to automate the collection of huge numbers of articles and learn the documents’ topics in an efficient and scalable manner without the need for human intervention.

These topical assignments of the articles allow us to find articles which talk about similar things and also find articles which are extremely different from one another without ever having to read the article. Applying this to the context of safety on the internet, based solely on the words used in an article, we can classify potentially dangerous articles for a younger readership.

An added benefit of the LDA model is that the results are fully interpretable. For instance, we can easily understand why the machine learning algorithm has flagged a particular article as dangerous. This is something that is lacking in most deep learning implementations of natural language processing. This allows us to understand fully the behaviour of the algorithm and, if need be, review any of the topical assignments made - allowing us to analyse and improve the algorithm as we progress.

#### The Results of Prototyping:

Written a masters thesis on the concept. Have researched the theoretical applications thoroughly. From the concept have created a Proof of Concept where we have tested out the algorithm which shows promising results. The next step is to retrieve a larger data set to improve the models accuracy even further.

The current implementation shows practical proof of the theorised scalable learning method. The accuracy of the topical classification also proves to be comparable to currently used methods - where the shear increase in volume of articles combats the potential loss in accuracy from the scalable method. Here are the results using a corpus of 2000+ articles for [3 topics](README_contents/k3.png), [10 topics](README_contents/k10.png) and [50 topics](README_contents/k50.png).

We are constantly running tests to understand our model and results better. The current topical classifications of our results on 2 datasets (approx 800 and 2000 words) work at distinguishing some more general topics present, but we expect that these results will significantly improve by the time the dataset grows to the tens of thousands.

In gathering the data, we have recently had great technical improvements with a fully automated adding of recent articles to the database (currently limited by our compute power and storage capacity) which will improve our testing capabilities in the near future.


#### The Milestones over 12 Months:

1. Improve machine learning algorithm to get large and more accurate category sets
2. UI/UX to improve accessibility and encourage use
3. Create frontend website
4. Add trigger warning capabilities to potentially harmful content
5. Create safe space mode to remove all potentially harmful content
6. Create feature to prompt users when accessing large quantities of potentially harmful content


#### The Estimated Budget:
We will assign the budget allocation for each milestone:

1. (Budget Allocation: 15000) Improve machine learning algorithm to get large and more accurate category sets
 - Testing Alternative models
 - Analysing model outputs
 - Improving algorithm logic


2. (Budget Allocation: 5000) UI/UX to improve accessibility and encourage use
Market Research
 - Asset Creation
 - App Design


3. (Budget Allocation: 5000) Create frontend website
 - Implementing designs in react
 - Creating backend APIs to access the backend data


4. (Budget Allocation: 5000) Add trigger warning capabilities to potentially harmful content
 - UI/UX design
 - React Site creation


5. (Budget Allocation: 5000) Create safe space mode to remove all potentially harmful content
 - UI/UX design
 - React Site creation


6. (Budget Allocation: 5000) Create feature to prompt users when accessing large quantities of potentially harmful content - chatbot
 - UI/UX design
 - React Site creation


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
***Bio:*** I am a third year Economics & Management student at University of Bristol. I’m a social media manager for The Pangean, an online magazine where I increase outreach and capture audiences through social media. Being very interested in journalism, I’ve also taken on a role as a podcast writer for PPI UK.  A passion in humanitarian and environmental work will also allow me to manage the business through an ethical lens. Finally, my experience in consulting can offer valuable insight into business operations ensuring the project runs efficiently and successfully.  
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

Latent Dirichlet Allocation (LDA) is one such topic model.  The overall assumptions of the model are that for a fixed vocabulary and pre-determined number of topics, each topic asserts a different distribution of words over the vocabulary. For example, words like law, legal and legislation are more probable under the topic corresponding to politics than they are under the topic corresponding to economics.  This is not to say that it is impossible for the word ‘legislation’ to be drawn from a topic assignment corresponding to economics, it is just very improbable.  Furthermore, the model assumes that within the corpus, each word of each document has some topic assignment which follows the proportion of topics assigned to the document; therefore, if a document is made up of three topics with equal proportions, the topic assignment of the words that make up the document would reflect that.

For K topics, a vocabulary of size V and a corpus with D documents/articles, the LDA model has the following [graphical model representation](README_contents/LDA-Graphical-Model.png) where its assumptions are best given by its corresponding [generative model](README_contents/LDA-Generative-Model.png).

---------------
### References

Hoffman, M.D., Blei, D.M., Wang, C. and Paisley, J., 2013. Stochastic variational inference. The Journal of Machine Learning Research, 14(1), pp.1303-1347.
