'''
Input: a stringified list of strings (i.e. URLs)
Outputs: a stringified list of strings (i.e. article content)

Error: If there is an error with a url it will return type None instead of the article content
'''


import library as lib
import sys
import ast

def main():
    urls = ast.literal_eval(str(sys.argv[1]))
    return [ lib.download_article(url) for url in urls]

if (__name__ == "__main__"):
    print(str(list(main())))
