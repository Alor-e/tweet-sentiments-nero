import spacy
from spacy.pipeline import TextCategorizer

nlp = spacy.blank("en")
# textcat = nlp.create_pipe("textcat")
textcat = TextCategorizer(nlp.vocab)
nlp.add_pipe(textcat)
trained_model = nlp.from_disk("spacy_model")


# test_text = "today is such a great day!"
# doc = nlp(test_text)
# print(test_text, doc.cats)