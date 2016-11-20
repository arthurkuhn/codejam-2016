# -*- coding: utf-8 -*-
import requests
import json
import exportHelper
import importHelper
import scraper


def main():
    
    movieList = importHelper.fetchShowsList()
    
    counter = 0
    for movTitle in movieList:
        #Pull Data
        query = "http://www.omdbapi.com/?t=" + movTitle + "&y=&plot=long&tomatoes=true&r=json&type=series"
        r = requests.get(query)
        
        show = json.loads(r.content.decode("utf-8") )
        #print(json.dumps(showimdb, sort_keys=False,indent=4, separators=(',', ': ')))
        
        print("Getting Metacritic Data")
        metacriticData = scraper.getMetaCriticData(movTitle)
        
        if(not(isValid(show))):
            continue
        if(type(metacriticData) is int):
            metacriticData = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
            print("Bad Meta for Show: " + movTitle)
        
        show["criticscore"] = metacriticData[0]
        show["criticcount"] = metacriticData[1]
        show["criticpos"] = metacriticData[2]
        show["criticmixed"] = metacriticData[3]
        show["criticneg"] = metacriticData[4]
        show["userscore"] = metacriticData[5]
        show["usercount"] = metacriticData[6]
        show["userpos"] = metacriticData[7]
        show["usermixed"] = metacriticData[8]
        show["userneg"] = metacriticData[9]
            
        if(counter == 0):
            init = True
        else :
            init = False
        
        exportHelper.exportShow(show,init)
        counter+=1
        print(counter)
    
    print("Imported: " + str(counter) + " showimdbs")


def isValid(response):
    if 'Error' in response:
        return False
    if("http" not in response["Poster"]):
        return False
    return True
    
if __name__ == "__main__":
    main()