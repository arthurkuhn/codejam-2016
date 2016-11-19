# -*- coding: utf-8 -*-
"""
Created on Sat Nov 19 11:27:28 2016

@author: Arthur
"""
import csv

def fetchShowsList():
    resultList = []
    with open('movieList.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in spamreader:
            resultList.append(row)
            print(', '.join(row))

    return []