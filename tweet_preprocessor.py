import preprocessor as p
import numba
from spacy.lang.en import English
from spacy.lang.en.stop_words import STOP_WORDS


# nlp = spacy.load("en_core_web_sm")
nlp = English()


def clean_tweet(text, further_clean=False):
    processed_text = p.clean(text).lower()

    if further_clean:
        doc = nlp.make_doc(processed_text)
        processed_text = ' '.join(
            [token.lemma_ for token in doc if token.is_stop == False | token.is_punct == False])

    return processed_text

# def process_tweet(text):
#     doc = nlp(text)
#     processed_text = ' '.join([token.lemma_ for token in doc if token.is_stop == False])
#     pass
