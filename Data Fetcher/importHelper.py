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
    with codecs.open('metacriticShowList.csv', encoding='utf8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for row in spamreader:
            if(":" in row[0]):
                limit = row[0].find(":")
                show_name = row[0][0:limit]
                if("User" in show_name):
                    continue
                print(show_name)
                if(show_name not in resultList):
                    resultList.append(show_name)
   
    return resultList
