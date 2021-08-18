# Library

## I. Intro

TradingView.com is a stock screening platform that boils down all the technical numbers behind a company's valuation, performance... etc. into a simple rating: *strong buy, buy, neutral, sell, strong sell.* This is great for less experienced investors like myself, because it provides a quick and straightforward insight into a company’s potential as an investment. 

I decided to put a twist on [this](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/library) simple library project from The Odin Project, and turn it into a tool which helps me automate the process of analyzing Trading View’s basic stock screening. 


## II. Overview

Because there isn’t a publically available TradingView API (it’s only for brokers), I opted to scrape the data myself. The web scraper runs on Heroku so it can send out an email autonomously every morning. Upon creating the library with vanilla JS, I used Firebase for user login and cloud data storage. This way the stocks entered by each user would save to their account and the web scraper had somewhere to pull the right stocks from. 


## III. Technical Overview

User auth: sign in with google or github

Client side library + database: 
- Add and delete stocks: "exchange-ticker" ex: *NASDAQ-MSFT* + Toggle “tracking” on/off
- All user data is sent to a firebase realtime database

![alt text](https://github.com/Kyle-Zhou/StockScrapingLibrary/blob/master/images/clientLibrary.png)

Server: node.js (Puppeteer) web scraping app hosted on heroku. Nodemailer sends out an email update to individual users reporting each stock’s buy rating every morning.


## IV. Issues

WebDriver’s like Puppeteer usually have some issues running on cloud based hosting platforms like Heroku. Timeout/crashing issues arise when too many users are created and add too many different stocks to screen. Or maybe it’s just the code. That’s probably it. 
