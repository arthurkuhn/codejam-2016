# -*- coding: utf-8 -*-
import requests
import json
import exportHelper
import importHelper
import scraper
from kmeansAlgo import Model
import genres_constant
import numpy as np


def main():
    
    movieList = importHelper.fetchShowsList()
    mod = Model()
    
    counter = 0
    for movTitle in movieList:
        #Pull Data
        query = "http://www.omdbapi.com/?t=" + movTitle + "&y=&plot=long&tomatoes=true&r=json&type=series"
        r = requests.get(query)
        
        show = json.loads(r.content.decode("utf-8"))
        #print(json.dumps(showimdb, sort_keys=False,indent=4, separators=(',', ': ')))
        
        print("Getting Metacritic Data")
        metacriticData = scraper.getMetaCriticData(movTitle)
        print("Got Meta Data")
        
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
        
        exportHelper.cleanShow(show)
        
        genres = show["Genre"]
        
        to_pred = []
        to_pred.append(show["imdbVotes"])
        #Add cats
        for i in range(3):
            if(len(genres)>i):
                temp = genres_constant.getGenreNum(genres[i])
                to_pred.append(temp)
            else :
                to_pred.append(temp)
        to_pred.append(show["imdbRating"])
        to_pred.append(show["criticscore"])
        to_pred.append(show["criticcount"])
        to_pred.append(show["criticpos"])
        to_pred.append(show["criticmixed"])
        to_pred.append(show["userscore"])
        to_pred.append(show["usercount"])
        to_pred.append(show["userpos"])
        to_pred.append(show["usermixed"])
        to_pred.append(show["userneg"])
        
        
        algoData = np.asarray(to_pred).reshape(1, -1)
        res = mod.predict(algoData)
            
        show["Kmeans"] = res[0]
        
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