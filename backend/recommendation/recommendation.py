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
    movies = client.group4.notes.find()############################changer movies
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
def recommendation_v2(data):
    '''prend un tableau panda en entrée, et l'id de l'user\n
    renvoie la matrice de similarité utilisateur et la matrice de notations,\n
    la liste des id des films et la liste des id d'utilisateurs'''
    movie_matrix = data.pivot_table(index='user', columns='movie', values='note')
    # print(movie_matrix,data,'e',(len(movie_matrix),(movie_matrix[453395]['629f5bc810cc1325b9530aea'])))
    user_id = list(movie_matrix.index)
    liste_id = list(movie_matrix.columns)
    # pos = user_id.index(id_user)
    data_matrix = np.zeros((len(movie_matrix),len(movie_matrix.columns)))
    # for line in data.itertuples():
    #     data_matrix[line[1]-1, line[2]-1] = line[3]
    for i in range(len(movie_matrix)):
        for j in range(len(movie_matrix.columns)):
            n = movie_matrix[liste_id[j]][user_id[i]]
            if type(n) == int or type(n) == float:
                data_matrix = n
    from sklearn.metrics.pairwise import pairwise_distances
    user_similarity = pairwise_distances(data_matrix, metric='cosine')
    return user_similarity,data_matrix,liste_id,user_id

def update_recommended_user(user_id,film_reco):
    '''Pour un user_id, modifie la liste des films recommendés'''
    client = MongoClient(MONGO_BD_URL)
    client.group4.users.find_one_and_update({'_id':user_id},{'$set':{'recommendedMovies':film_reco}})

def trouver_films(film_id,liste_note):
    '''pour une liste de note, renvoie la liste des id des films les mieux notés'''
    film_reco = []
    for i in range(min(len(liste_note),20)):
        m = liste_note[i]
        index = i
        for j in range(i,len(liste_note)):
            if liste_note[j] > m:
                m = liste_note[j]
                index = j
        film_reco.append(str(film_id[index]))
        film_reco[i],film_reco[index] = film_reco[index],film_reco[i]
        liste_note[i],liste_note[index] = liste_note[index],liste_note[i]
    return film_reco

def update_recommended():
    data = create_matrix()
    user_sim,data_matrice,film_id,user_id = recommendation_v2(data)
    pred = predict_usine_a_gaz(data_matrice, user_sim)
    for i in range(len(user_id)):
        print(f"On en est au {i}e user")
        film_reco = trouver_films(film_id,pred[i])
        update_recommended_user(user_id[i],film_reco)
    return None
update_recommended()

###########################################################
#On verra plus tard
def predict_mieux(ratings, similarity,pos):
    '''ratings: liste de liste avec les notes
    similarity: liste de liste avec les similarités entre deux users
    pos: index de l'utilisateur '''

    return "c'est mieux"