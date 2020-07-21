import pandas as pd
from tweet_preprocessor import clean_tweet


tweet_data = pd.read_csv('sa-emotions/train_data_2.csv', engine='c')

tweet_data['clean_content'] = tweet_data['content'].apply(clean_tweet)

# print(tweet_data.head(5))
