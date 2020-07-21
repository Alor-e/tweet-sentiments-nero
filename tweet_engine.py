import preprocessor as p
from TwitterAPI import TwitterAPI
from spacy_test import trained_model
from textblob import TextBlob
import time


api = TwitterAPI('Fp33cJdSOIVHbHuBzMdxc6Ti4', 'hb3Nrv45EHqMChec0I9klhvf43GSa7dWGSZfLj9HAe7XlCK26n',
                 '4814739855-Pf3fHreKdpBsntvIpXEBsREgzVYxv9AtWrIzMuu', '1TUMxvJSZf7vpsiNATihqkcVZfEOraHeoWSCZTWGN2faT')


def text_processor(item):
    if 'full_text' in item:

        processed_text = p.clean(item['full_text']).lower()
        doc = trained_model(processed_text)
        t_blob = TextBlob(processed_text)

        holder = {'id': item['id_str'], 'text': item['full_text'],
                  'created_at': item['created_at'], 'emotions': doc.cats,
                  'user_name': item['user']['name'], 'user_screen_name': item['user']['screen_name'],
                  'sentiment': {'polarity': t_blob.sentiment.polarity, 'subjectivity': t_blob.sentiment.subjectivity}}
    return holder


def tweet_engine(tweet_term):

    r = api.request('search/tweets', {'q': tweet_term, 'count': 100, 'tweet_mode':'extended', 'lang':'en'})

    engine_output = [text_processor(item) for item in r]

    return engine_output
