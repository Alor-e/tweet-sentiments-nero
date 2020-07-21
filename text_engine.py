import preprocessor as p
from spacy_test import trained_model
from textblob import TextBlob


def text_engine(text):
    processed_text = p.clean(text).lower()
    doc = trained_model(processed_text)
    t_blob = TextBlob(text)

    def text_processor(sentence):
        text = str(sentence)
        polarity = sentence.polarity
        subjectivity = sentence.subjectivity
        emotions = trained_model(text)

        holder = {'text': text, 'subjectivity': subjectivity,
                  'polarity': polarity, 'emotions': emotions.cats}

        return holder

    if len(t_blob.sentences) > 1:
        engine_output = [text_processor(sentence)
                         for sentence in t_blob.sentences]
    else:
        engine_output = []

    response = {'text': text, 'emotions': doc.cats,
                'sentiment': {'polarity': t_blob.sentiment.polarity, 'subjectivity': t_blob.sentiment.subjectivity},
                'sentences': engine_output}

    return response
