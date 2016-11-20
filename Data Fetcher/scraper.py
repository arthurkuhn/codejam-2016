# -*- coding: utf-8 -*-
"""
Created on Sun Nov 20 10:15:55 2016

@author: Arthur
"""

from lxml import html
import requests
import importHelper
import time
import csv
import re

def scrapeMetacritic(showName):
    baseUrl = getUrl(showName)
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
    url = baseUrl + '/critic-reviews'
    page = requests.get(url, headers=headers)
    tree = html.fromstring(page.content)
    if(page.status_code == 403):
        return -2
    if(page.status_code != 200):
        print("Getting better URL")
        baseUrl = searchShow(showName)
        url = baseUrl + '/critic-reviews'
        page = requests.get(url, headers=headers)
        tree = html.fromstring(page.content)
    
    criticReviews = []
    
    #print(page.content)
    displayRating_c = tree.xpath('//*[@id="main"]/div[3]/div/div[1]/div/a/div/span/text()')
    criticReviews.append(clean(displayRating_c))
    reviewCount_c = tree.xpath('//*[@id="main"]/div[3]/div/div[1]/div/div[2]/p/span[2]/strong/text()')
    criticReviews.append(clean(reviewCount_c))
    positiveReviews_c = tree.xpath('//*[@id="main"]/div[3]/div/div[2]/div/ol/li[1]/div/span[2]/a/span/span[1]/text()')
    criticReviews.append(clean(positiveReviews_c))
    mixedReviews_c = tree.xpath('//*[@id="main"]/div[3]/div/div[2]/div/ol/li[2]/div/span[2]/a/span/span[1]/text()')
    criticReviews.append(clean(mixedReviews_c))
    negativeReviews_c = tree.xpath('//*[@id="main"]/div[3]/div/div[2]/div/ol/li[3]/div/span[2]/span/span[1]/text()')
    criticReviews.append(clean(negativeReviews_c))
    
    userReviews = []
    url = baseUrl + '/user-reviews'
    page = requests.get(url, headers=headers)
    tree = html.fromstring(page.content)
    if(page.status_code != 200):
        return -1
        
    displayRating_u = tree.xpath('//*[@id="main"]/div[3]/div/div[1]/div/div[2]/text()')
    userReviews.append(clean(displayRating_u))
    reviewCount_u = tree.xpath('//*[@id="main"]/div[3]/div/div[1]/div/div[3]/p/span[2]/strong/text()')
    userReviews.append(clean(reviewCount_u))
    positiveReviews_u = tree.xpath('//*[@id="main"]/div[3]/div/div[2]/div/ol/li[1]/div/span[2]/a/span/span[1]/text()')
    userReviews.append(clean(positiveReviews_u))
    mixedReviews_u = tree.xpath('//*[@id="main"]/div[3]/div/div[2]/div/ol/li[2]/div/span[2]/a/span/span[1]/text()')
    userReviews.append(clean(mixedReviews_u))
    negativeReviews_u = tree.xpath('//*[@id="main"]/div[3]/div/div[2]/div/ol/li[3]/div/span[2]/a/span/span[1]/text()')
    userReviews.append(clean(negativeReviews_u))
    
    print(criticReviews)
    print(userReviews)
    
    if((sum(criticReviews) + sum(userReviews))<20):
        return -3
    
    return criticReviews + userReviews

def getUrl(showName):
    movTitleLower = showName.lower()
    movTitle = movTitleLower.replace(" ", "-")
    url = "http://www.metacritic.com/tv/" + movTitle
    return url
    

def clean(obj):
    if(type(obj) is list):
        if(len(obj)<1):
            return -1
    try:
        val = int(obj[0])
        return val
    except ValueError:
        m = re.search('\d+', obj[0])
        try:
            val = int(m.group(0))
            return val
        except (ValueError,AttributeError):
            print("Error" + obj[0])
            return -1
        
    
def handleError(movie,message):
    with open("errorLog.csv", 'a', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        log = []
        log.append(movie)
        log.append(message)
        spamwriter.writerow(log)

def getMetaCriticData(movie):
     metaRatings = scrapeMetacritic(movie)
     if(metaRatings == -3):
         handleError(movie,"Not Enough Info")
     if(metaRatings == -2):
         handleError(movie,"Forbidden")
     if(metaRatings==-1):
         handleError(movie, "Connection Error")
     return metaRatings
    
     
def searchShow(showName):
    url ="http://www.metacritic.com/search/all/" + showName + "/results?cats%5Btv%5D=1&search_type=advanced"
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
    page = requests.get(url, headers=headers)
    tree = html.fromstring(page.content)
    correctUrl = tree.xpath('//*[@id="main"]/div[2]/div[1]/ul/li/div[2]/div/div[1]/h3/a/@href')
    handleError(showName, "Using url: " + correctUrl)
    page = requests.get(correctUrl, headers=headers)
    tree = html.fromstring(page.content)
    return tree
    
        
            
def main():
    with open("metacritic.csv", 'w', newline='') as csvfile:
        spamwriter = csv.writer(csvfile,delimiter = ',', quotechar = '"', doublequote = True, skipinitialspace = True, lineterminator = '\r\n', quoting = csv.QUOTE_MINIMAL)
        spamwriter.writerow(["Title","Critic Score","Critic Count","Critic Pos","Critic Mixed","Critic Neg","User Score","User Count","User Pos","User Mixed","User Neg"])
        movieList = importHelper.fetchShowsList()
        counter = 0
        for movie in movieList:
            metaRatings = scrapeMetacritic(movie)
            if(metaRatings == -3):
                handleError(movie,"Not Enough Info")
                continue
            if(metaRatings == -2):
                handleError(movie,"Forbidden")
                print("Too fast, waiting 60s")
                time.sleep(60)
                continue
            if(metaRatings==-1):
                handleError(movie, "Connection Error")
                continue
            metaRatings.insert(0,movie)
            counter+=1
            print(counter)
            time.sleep(2)
            spamwriter.writerow(metaRatings)
    
if __name__ == "__main__":
    main()