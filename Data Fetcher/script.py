# -*- coding: utf-8 -*-
import requests
import csv


def main():
    
    mondbPutUrl = "http://localhost:3000/postMovie"
    fileAddress = "test.csv"
    
    #Pull Data
    title = "Ocean's Eleven"
    query = "http://www.omdbapi.com/?t=" + title + "&y=&plot=long&tomatoes=true&r=json"
    
    r = requests.get(query)
    print(r.content)
    print(r.status_code)
    print(r.json())
    
    payload = r.json()
    
    #Send to DB
    r = requests.post(mondbPutUrl, data = payload)
    
    print(r.content)
    print(r.status_code)
    #Save as a new row in a csv File
    
    with open(fileAddress, 'wb') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(payload)
        
    print("done")
    
    
    

if __name__ == "__main__":
    main()




