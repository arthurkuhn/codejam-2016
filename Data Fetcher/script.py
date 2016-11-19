# -*- coding: utf-8 -*-
import requests
import csv
import json


def main():
    
    mondbPutUrl = "http://localhost:3000/postMovie"
    fileAddress = "test.csv"
    
    #Pull Data
    title = "Ocean's Eleven"
    query = "http://www.omdbapi.com/?t=" + title + "&y=&plot=long&tomatoes=true&r=json"
    r = requests.get(query)
    
    #print(r.content)
    #print(r.status_code)
    #print(r.content)
    
    show = json.loads(r.content.decode("utf-8") )
    #print(json.dumps(show, sort_keys=False,indent=4, separators=(',', ': ')))
    
    
    #Send to DB
    #r = requests.post(mondbPutUrl, data = show)
    
    #Save as a new row in a csv File
    row = getRow(show)
    print(type(row))
    
    with open(fileAddress, 'w', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(row)
        
    print("done")
    
def getRow(show):
    valuesToGet = ["Title","Plot","Metascore","imdbVotes","tomatoUserMeter"]
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
            return False

def cleanNumber(number):
    str = number.replace(",","")
    return int(str)

if __name__ == "__main__":
    main()




