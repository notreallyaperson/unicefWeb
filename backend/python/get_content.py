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
        article = newspaper.Article(url)
        article.download()
        article.parse()
        return article.text
    except:
        raise Exception("Error: Invalid url.")


def main():
    url = ast.literal_eval(sys.argv[1])
    return download_article(url)

if (__name__ == "__main__"):
    print(str(main()))
    sys.stdout.flush()
