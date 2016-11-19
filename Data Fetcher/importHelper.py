# -*- coding: utf-8 -*-
"""
Created on Sat Nov 19 11:27:28 2016

@author: Arthur
"""
import codecs
import csv

def fetchShowsList():
    resultList = []
    with codecs.open('movieList.csv', encoding='utf8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in spamreader:
            #print(row[0])
            i1 = row[0].find('.')
            i2 = row[0].find('(')
            #print(str(i1) + ":" + str(i2))
            show_name = row[0][i1+2:i2-1]
            print(show_name)
            resultList.append(show_name)
   
    return resultList
