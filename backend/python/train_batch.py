'''
Input: a stringified object as follows
            {
            'vocabulary': [str] ,
            'sizeOfCorpus': int ,
            'sizeOfBatch': int,
            'numberOfTopics': int,
            'iteration': int,
            'lambda': [[float]]
            'articles': [str]
            }
Outputs: a stringified object as follows
            {
            'gamma': [float],
            'lambda': [float]
            }

Error: If there is an error it will return type None instead of the model params
'''


import library as lib
import sys
import ast

def main():
    try:
        args_obj = ast.literal_eval(str(sys.argv[1]))

        # initialise model
        model = lib.OnlineLDA(args_obj['vocabulary'], args_obj['sizeOfCorpus'], args_obj['sizeOfBatch'],  args_obj['numberOfTopics'])

        # load previous state of the model
        if ('iteration' in args_obj.keys()):
            model._T = int(args_obj['iteration'])
        if ('lambda' in args_obj.keys()):
            model._lambda = np.array(args_obj['lambda'])

        # batch train the model
        gam, lam = model.update_params_batch_SVI(args_obj['articles'])

        return { 'gamma': gam.tolist(), 'lambda': lam.tolist() }
    except:
        return None

if (__name__ == "__main__"):
    print(str(main()))
