# -*- coding: utf-8 -*-
import requests
import json
import exportHelper
import importHelper


def main():
    
    movieList = importHelper.fetchShowsList()
    
    counter = 0
    for movTitle in movieList:
        #Pull Data
        query = "http://www.omdbapi.com/?t=" + movTitle + "&y=&plot=long&tomatoes=true&r=json"
        r = requests.get(query)
        
        show = json.loads(r.content.decode("utf-8") )
        #print(json.dumps(show, sort_keys=False,indent=4, separators=(',', ': ')))
        
        if(not(isValid(show))):
            continue

        
    
        exportHelper.exportShow(show)
        counter+=1
    
    print("Imported: " + str(counter) + " shows")


def isValid(response):
    if 'Error' in response:
        return False
    if("http" not in response["Poster"]):
        return False
    return True
    
if __name__ == "__main__":
    main()