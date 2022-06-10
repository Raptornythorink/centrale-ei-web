import numpy as np
import pandas as pd
import os
from pymongo import MongoClient
import pymongo
from json import load
from json import dumps as json_dumps
from bson.json_util import dumps
from dotenv import load_dotenv,find_dotenv
load_dotenv(find_dotenv())
MONGO_BD_URL = os.environ.get('MONGO_DB_URL')

def get_database():
    '''retourne le Mongo Cursor de la DB de notations'''
    client = MongoClient(MONGO_BD_URL)
    movies = client.group4.movies.find()############################changer movies
    return movies

#######################################################################
def create_matrix():
    '''retourne un format panda des notations'''
    return pd.read_json(dumps(list(get_database())))


#On considère que data contient les notes films/users
def recommendation(data,id_user):
    '''prend un tableau panda en entrée, et l'id de l'user\n
    renvoie la matrice de similarité utilisateur et la matrice de notations,\n
    la liste des id des films et l'index de l'utilisateur dans la liste des id d'utilisateurs'''
    movie_matrix = data.pivot_table(index='user', columns='movie', values='note')
    user_id = list(movie_matrix.index)
    liste_id = list(movie_matrix.columns)
    pos = user_id.index(id_user)
    data_matrix = np.zeros((len(data), len(data[0])))
    for line in data.itertuples():
        data_matrix[line[1]-1, line[2]-1] = line[3]
    from sklearn.metrics.pairwise import pairwise_distances
    user_similarity = pairwise_distances(data_matrix, metric='cosine')
    return user_similarity,data_matrix,liste_id,pos

def predict_usine_a_gaz(ratings, similarity, type='user'):
    '''prend la matrice des notes utilisateurs items et la matrice de similarité,
    renvoie la prédiction de notes,
    complexité très mauvaise pour le but voulu'''
    if type == 'user':
        mean_user_rating = ratings.mean(axis=1)
        #You use np.newaxis so that mean_user_rating has same format as ratings
        ratings_diff = (ratings - mean_user_rating[:, np.newaxis])
        pred = mean_user_rating[:, np.newaxis] + similarity.dot(ratings_diff) / np.array([np.abs(similarity).sum(axis=1)]).T
    elif type == 'item':
        pred = ratings.dot(similarity) / np.array([np.abs(similarity).sum(axis=1)])
    return pred


def predi_film(ratings,similarity,pos):
    pred = predict_usine_a_gaz(ratings, similarity)
    return pred[pos]

def dico_note_film(pred,liste_film_id):
    '''prend une liste de résultats et d'id de films et renvoie un dico avec comme clés les id et comme valeur les notes'''
    dico_resultat = {}
    for i in len(pred):
        dico_resultat[liste_film_id[i]] = pred[i]
    return dico_resultat

def notes_triees(pred,liste_film_id):
    '''prend une liste de résultats et d'id de films et renvoie un json avec les id des films et les notes prédites décroissantes'''
    json_obj = []
    for i in len(pred):
        d = {}
        d['id']=liste_film_id[i]
        d['note']=pred[i]
    json_obj = sorted(json_obj, key=lambda x : x['note'], reverse=True)
    return json_dumps(json_obj)

def trouver_note_dico(user_id):
    '''pour un user_id donné, renvoie un dico avec, pour des id de films, les notes associées'''
    matrix = create_matrix()
    user_sim, data_matrix, liste_id, pos = recommendation(matrix, user_id)
    pred = predi_film(data_matrix,user_sim,pos)
    return dico_note_film(pred, liste_id)

def trouver_note_json(user_id):
    '''pour un user_id donné, renvoie un json avec, pour des id de films, les notes associées décroissantes'''
    matrix = create_matrix()
    user_sim, data_matrix, liste_id, pos = recommendation(matrix, user_id)
    pred = predi_film(data_matrix,user_sim,pos)
    return notes_triees(pred, liste_id)

#######################################################
#On verra plus tard
def predict_mieux(ratings, similarity,pos):
    '''ratings: liste de liste avec les notes
    similarity: liste de liste avec les similarités entre deux users
    pos: index de l'utilisateur '''

    return "c'est mieux"