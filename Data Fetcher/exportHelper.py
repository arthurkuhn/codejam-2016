# -*- coding: utf-8 -*-
"""
Created on Sat Nov 19 11:05:18 2016

@author: Arthur
"""
import csv
import requests
import genres_constant

def exportShow(show,init):
    
    cleanShow(show)
    
    #Send to DB
    #addShowToDb(show)
    
    #Save as a new row in a csv File
    
    
    
    valuesToGet = ["Title","Plot","Metascore","imdbVotes","tomatoUserMeter","tomatoUserRating","tomatoRating","imdbRating"]
    addShowToCsv(show, valuesToGet, "withText.csv")
    
    if(init):
        addHeaderRow("withText.csv",valuesToGet)
    
    valuesToGet = ["Title","Genre","Metascore","imdbVotes","imdbRating","criticscore","criticcount","criticpos","criticmixed","criticneg","userscore","usercount","userpos","usermixed","userneg","Kmeans"]
    addShowToCsv(show, valuesToGet, "numsonly.csv")
    
    if(init):
        addHeaderRow("numsonly.csv",valuesToGet)

def addShowToDb(show):
    mondbPutUrl = "http://localhost:8080/postMovie"
    r = requests.post(mondbPutUrl, data = show)
    print(r.status_code)
    print(r.content)
    
def addHeaderRow(fileName,row):
    print(row)
    with open(fileName, 'w', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
    
def addShowToCsv(show, values,fileAddress):
    row = getRow(show, values)
    with open(fileAddress, 'a', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
    
    
def getRow(show, values):
    row = []
    for id in values:
        if(id == "Genre"):
            for i in range(3):
                if(len(show[id])>i):
                    temp = genres_constant.getGenreNum(show[id][i])
                    row.append(temp)
                else :
                    row.append(temp)
        else :
            row.append(show[id])
        
    return row    
    
    
def is_number(s):
    if(type(s) is list):
        return False
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
        if(type(show[key]) is int):
            continue
        if(type(show[key]) is list):
            continue
        if(type(show[key]) is float):
            continue
        if(key == "Genre"):
            arr = []
            genres = show[key].split(",")
            for genre in genres:
                tmp = genre.replace(",","")
                arr.append(tmp.strip())
            show[key] = arr
        if("N/A" in show[key]):
            show[key] = "0"
        if(is_number(show[key])):
            c_num = cleanNumber(show[key])
            show[key] = c_num