'''
Input: a stringified list of strings (i.e. URLs)
Outputs: a stringified list of strings (i.e. article content)

Error: If there is an error with a url it will return type None instead of the article content
'''


import newspaper
import sys
import ast

# Getting article information from url using newspaper package
# function of type string -> string
# error catch returns None when not a valid url
def download_article(url):
    try:
        user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
        config = newspaper.Config()
        config.browser_user_agent = user_agent
        article = newspaper.Article(url, config=config)
        article.download()
        article.parse()
        return article.text
    except:
        raise Exception("Error: Invalid url.")


def main():
    url = ast.literal_eval(sys.argv[1]) # input is an array strings with 1 entry
    url = url[0]
    print (url)
    return download_article(url)

if (__name__ == "__main__"):
    print(str(main()))
    sys.stdout.flush()
