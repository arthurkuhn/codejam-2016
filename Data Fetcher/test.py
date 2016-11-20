# -*- coding: utf-8 -*-
"""
Created on Sun Nov 20 17:06:13 2016

@author: Arthur
"""

from kmeansAlgo import Model

X = np.genfromtxt("C:\\Users\\Arthur\\Documents\\GitHub\\codejam\\Data Fetcher\\forAlgo.csv",delimiter=',')
mod = Model()
testsamp = X[1,:].reshape(1, -1)
print(mod.predict(testsamp))
print(mod.model)