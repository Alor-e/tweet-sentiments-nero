
import random
import spacy
from spacy.lang.en import English
from spacy.pipeline import TextCategorizer
from spacy.util import minibatch, compounding
from panda_to_spacy import TRAINING_DATA, sentiment_list


# nlp = English()
# textcat = TextCategorizer(nlp.vocab)

nlp = spacy.blank("en")
textcat = nlp.create_pipe("textcat")
nlp.add_pipe(textcat)


for i in sentiment_list:
  textcat.add_label(i)


nlp.begin_training()
print('Training...')

for i in range(10):
  
  random.shuffle(TRAINING_DATA)
  losses={}
  print('In loop', i)

  for batch in minibatch(TRAINING_DATA, size=50):
    
    texts = [text for text, entities in batch]
    annotations = [entities for text, entities in batch]

    nlp.update(texts, annotations, losses=losses)

nlp.to_disk("spacy_model")

