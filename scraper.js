const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

var admin = require('firebase-admin');

var serviceAccount = require('./admin.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://watchlist-82dc5-default-rtdb.firebaseio.com",
    authDomain: "project-id.firebaseapp.com",
});

var db = admin.database();
userRef = db.ref("users");
var dbInfo;
var dbArray = [];

var emailSender = require('./email');

// Attach an asynchronous callback 
userRef.on('value', (snapshot) => {
    dbInfo = snapshot.val();
    dbArray = (Object.entries(dbInfo));
    listAllUsers();

  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
}); 

const listAllUsers = (nextPageToken) => {  
    // List batch of users, 1000 at a time.
    admin
      .auth()
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
        //   console.log('user', userRecord.toJSON());
        //   addEmailsToArray(userRecord);
          checkScrape(userRecord);

        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
};

    

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'automated.dev.email@gmail.com',
      pass: '5aWpY9Gb3Brd'
    }
  });


var doneUser = false;

function checkScrape(userRecord){
    var container;
    var email;
    dbArray.forEach((element) => { 
        var uid1 = element[0];
        var uid2 = userRecord['uid'];
        if (uid1 === uid2){
            email = userRecord['email'];
            container = element[1];
            var tickers = [];
            tickers = (Object.values(container));
            var emailObject = {};
            doneUser = false;

            tickers.forEach((ticker) => {
                if (ticker['tracking'] === 'Yes'){
                    var t = ticker['ticker'];
                    scrape(t, email);
                }  
            })  
            doneUser = true;

            // const emailText = JSON.stringify(emailObject);

            // console.log(emailObject);
            // var mailOptions = {
            //     from: 'automated.dev.email@gmail.com',
            //     to: email,
            //     subject: 'Stock tracker - TV - Node.js',
            //     text: emailText
            // };     


            // transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //     }
            //   });


        } 
    })
    console.log(" ");
}


function scrape(ticker, email){
    console.log(ticker + " " + email);
    const url = 'https://www.tradingview.com/symbols/' + ticker + '/technicals/';
    puppeteer
    .launch()
    .then(browser => browser.newPage())
    .then(page => {
      return page.goto(url).then(function() {
        return page.content();
      });
    })
    .then(html => {
      const $ = cheerio.load(html);
      const summaryContainer = $('.speedometerWrapper-DPgs-R4s.summary-DPgs-R4s');
          
      summaryContainer.each(function () {
          const buyRating = $(this).find('.speedometerSignal-DPgs-R4s').text();
          console.log(ticker + ": " + buyRating);
          if (doneUser == false){
            emailObject.ticker = buyRating;
          } else if (doneUser == true) {

            console.log(emailObject);

            emailObject = {};
          }
      });

    })
    .catch(console.error);
   
}










//----------------------------------------------
// function addEmailsToArray(userRecord){
//     dbArray.forEach((element, index) => { 
//         var uid1 = element[0];
//         var uid2 = userRecord['uid'];
//         if (uid1 === uid2){
//             // console.log(uid1 + " " + userRecord['email']);
//             var emailx = userRecord['email'];
//             //Object.assign(element, {email: emailx});
//             element['email'] = emailx;
//             dbArray[index] = element;
//         }
//     })
// }

// function getEmail(userRecord){
//     dbArray.forEach((element) => { 
//         var uid1 = element[0];
//         var uid2 = userRecord['uid'];
//         if (uid1 === uid2){
//             var emailx = userRecord['email'];
//             console.log(emailx);
//             return emailx;
//         }
//     })
// }