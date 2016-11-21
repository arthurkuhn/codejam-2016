# -*- coding: utf-8 -*-
"""
Created on Sun Nov 20 15:54:21 2016

@author: Arthur
"""

from time import time
from sklearn.cluster import KMeans
import numpy as np
from sklearn import metrics
from sklearn.decomposition import PCA
from sklearn.preprocessing import scale

class Model(object):

    def __init__(self):
        X = np.genfromtxt("C:\\Users\\Arthur\\Documents\\GitHub\\codejam\\Data Fetcher\\forAlgo.csv",delimiter=',')
        np.random.seed(10)
        data = X
        n_samples, n_features = data.shape
        num_classes = 10
        #No PCA was used
        #reduced_data = PCA(n_components=2).fit_transform(data)
        estimator = KMeans(init='k-means++', n_clusters=num_classes, n_init=10)
        self.model = estimator.fit(data)

    def predict(self,row):
        return self.model.predict(row)