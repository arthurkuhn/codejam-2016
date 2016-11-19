# -*- coding: utf-8 -*-
"""
Created on Sat Nov 19 11:05:18 2016

@author: Arthur
"""
import csv

def exportShow(show):
    #Send to DB
    addShowToDb(show)
    
    #Save as a new row in a csv File
    addShowToCsv(show)
    

def addShowToDb(show):
    mondbPutUrl = "http://localhost:3000/postMovie"
    #r = requests.post(mondbPutUrl, data = show)
    
def addShowToCsv(show):
    fileAddress = "test.csv"
    row = getRow(show)
    with open(fileAddress, 'a', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
    
    
def getRow(show):
    valuesToGet = ["Title","Plot","Metascore","imdbVotes","tomatoUserMeter","tomatoUserRating","tomatoRating","imdbRating"]
    row = []
    for id in valuesToGet:
        val = show[id]
        if(is_number(val)):
            dat = cleanNumber(val)
        else :
            dat = val
        row.append(dat)
    return row
    
    
def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        try:
            str = s.replace(",","")
            int(str)
            return True
        except ValueError:
            try:
                float(str)
                return True;
            except ValueError:
                return False

def cleanNumber(number):
    str = number.replace(",","")
    try:
        ret = int(str)
        return ret
    except ValueError:
        return float(str)
    
