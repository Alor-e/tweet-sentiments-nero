
import multiprocessing as mp
import pandas as pd
import preprocessor as pre
import time
from tweet_preprocessor import clean_tweet


def process_tweet(n):
    return s


s = [1]


tweet_data = pd.read_csv('sa-emotions/train_data.csv', engine='c')


if __name__ == '__main__':
    pool = mp.Pool(mp.cpu_count())

    t3 = time.time()
    s = pool.map(process_tweet, s)

    t4 = time.time()
    print("time consuming after Parallel Processing to process the Dataset {0:.2f}s".format(
        round(t4-t3, 2)))

    t3 = time.time()
    tweet_data['clean_content'] = pool.map(clean_tweet, tweet_data['content'])

    t4 = time.time()
    print("time consuming after Parallel Processing to process the Dataset {0:.2f}s".format(
        round(t4-t3, 2)))
    pool.close()
    pool.join()

    print(tweet_data.head(5))
    # tweet_data.to_csv('file_name.csv')


# t1 = time.time()
# tweet_data['clean_content'] = tweet_data['content'].apply(
# clean_tweet)
# t2 = time.time()
# print("time consuming before Parallel Processing to process the Dataset {0:.4f}s".format(round(t2-t1, 4)))
# print(tweet_data.head(5))
# @timeit(repeat=3, number=3)

# def sentiment_counter(tweet_data):
#     for e in sentiment_list:
#         if tweet_data['sentiment'] == e:
#            tweet_data[e] = 1
#         else:
#             tweet_data[e] = 0


#     return tweet_data
