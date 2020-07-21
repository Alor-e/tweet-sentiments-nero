from test_ground import tweet_data


sentiment_list = tweet_data['sentiment'].drop_duplicates().to_list()

for sentiment in sentiment_list:
    tweet_data[sentiment] = 0


def sentiment_counter(tweet_data):
    a = tweet_data['sentiment']
    tweet_data[a] = 1
    return tweet_data


tweet_data = tweet_data.apply(sentiment_counter, axis=1)

spacy_training_text = tweet_data['clean_content'].to_list()

annotations = tweet_data[sentiment_list].to_dict('records')

annotations_final_list = []

for i in annotations:
    annot_dict = {"cats": i}
    annotations_final_list.append(annot_dict)

TRAINING_DATA = list(zip(spacy_training_text, annotations_final_list))

