# -*- coding: utf-8 -*-
"""
Created on Sat Nov 19 11:05:18 2016

@author: Arthur
"""
import csv
import requests

def exportShow(show):
    
    cleanShow(show)
    
    #Send to DB
    #addShowToDb(show)
    
    #Save as a new row in a csv File
    
    valuesToGet = ["Title","Plot","Metascore","imdbVotes","tomatoUserMeter","tomatoUserRating","tomatoRating","imdbRating"]
    addShowToCsv(show, valuesToGet, "withText.csv")
    
    valuesToGet = ["Title","Metascore","imdbVotes","imdbRating","tomatoUserMeter","tomatoUserRating","tomatoRating"]
    addShowToCsv(show, valuesToGet, "numsonly.csv")

def addShowToDb(show):
    mondbPutUrl = "http://localhost:8080/postMovie"
    r = requests.post(mondbPutUrl, data = show)
    print(r.status_code)
    print(r.content)
    
def addShowToCsv(show, values,fileAddress):
    row = getRow(show, values)
    with open(fileAddress, 'a', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
    
    
def getRow(show, values):
    valuesToGet = ["Title","Plot","Metascore","imdbVotes","tomatoUserMeter","tomatoUserRating","tomatoRating","imdbRating"]
    row = []
    for id in valuesToGet:
        row.append(show[id])
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

def cleanShow(show):
    for key in show:
        if("N/A" in show[key]):
            show[key] = ""
        if(is_number(show[key])):
            c_num = cleanNumber(show[key])
            show[key] = c_num