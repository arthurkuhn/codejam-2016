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
    print(json.dumps(show, sort_keys=False,indent=4, separators=(',', ': ')))
    print(show["Title"])
    #Send to DB1
    #r = requests.post(mondbPutUrl, data = payload)
    
    #Save as a new row in a csv File
    
    row = getRow(show)
    
    with open(fileAddress, 'wb') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        #spamwriter.writerow(row)
        
    print("done")
    
def getRow(jsonObj):
    #print(jsonObj)
    return
    
    
    

if __name__ == "__main__":
    main()




