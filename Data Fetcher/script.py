# -*- coding: utf-8 -*-
import requests
import json
import exportHelper


def main():

    #Pull Data
    title = "Ocean's Eleven"
    query = "http://www.omdbapi.com/?t=" + title + "&y=&plot=long&tomatoes=true&r=json"
    r = requests.get(query)
    
    #print(r.content)
    #print(r.status_code)
    #print(r.content)
    
    show = json.loads(r.content.decode("utf-8") )
    #print(json.dumps(show, sort_keys=False,indent=4, separators=(',', ': ')))

    exportHelper.exportShow(show)
    print("done")


if __name__ == "__main__":
    main()