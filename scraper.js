const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

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

// userRef.once('value', (data) => {
//     // do some stuff once
//     dbInfo = data.val();
//     dbArray = (Object.entries(dbInfo));
//     listAllUsers();
// });
  

//Attach an asynchronous callback 
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
var emailFile = require('./email');
var password = (emailFile.password);
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service:'gmail',
    secure: false,
    auth: {
        user: 'automated.dev.email@gmail.com',
        pass: password
    }
});


var emailObject = {};

function checkScrape(userRecord) {
    var container;
    var email;
    dbArray.forEach((element) => {
        var uid1 = element[0];
        var uid2 = userRecord['uid'];
        if (uid1 === uid2) {
            email = userRecord['email'];
            container = element[1];
            var tickers = [];
            tickers = (Object.values(container));
            emailObject[email] = {};

            test(tickers, email);

        }
    })
    console.log(" ");
}


async function test(tickers, email) {

    for (let i = 0; i < tickers.length; i++){
        if (tickers[i]['tracking'] === 'Yes') {
var t = tickers[i]['ticker'];


    await new Promise((resolve, reject) => {


        
        setTimeout(() => {

            console.log(t + " " + email);
            const url = 'https://www.tradingview.com/symbols/' + t + '/technicals/';
            puppeteer
                .launch()
                .then(browser => browser.newPage())
                .then(page => {
                    return page.goto(url).then(function () {
                        return page.content();
                    });
                })
                .then(html => {
                    const $ = cheerio.load(html);
                    const summaryContainer = $('.speedometerWrapper-DPgs-R4s.summary-DPgs-R4s');

                    summaryContainer.each(function () {
                        const buyRating = $(this).find('.speedometerSignal-DPgs-R4s').text();
                        //console.log(t + ": " + buyRating);
                        emailObject[email][t] = buyRating;
                        console.log(emailObject);
                        resolve();
                    });
                })
                .catch(console.error);
        }, 0);
    });
    
}
}
    //emailObject = {};
    console.log('3');
    sendEmail(email);
    //if i email here it should be fine i just need to specify which email
}


function sendEmail(email){
    const emailText = JSON.stringify(emailObject[email]); 
    var em_a = [];
    em_a = Object.entries(emailObject[email]);
    var str = "";

    em_a.forEach((entry) => {
        str += entry;
        str += '\n'  
    })

    console.log(str);
            var mailOptions = {
                from: 'automated.dev.email@gmail.com',
                to: email,
                subject: 'Stock tracker - TV - Node.js',
                text: str
            };     


            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
}



function scrape(ticker, email) {
    console.log(ticker + " " + email);
    const url = 'https://www.tradingview.com/symbols/' + ticker + '/technicals/';
    puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then(function () {
                return page.content();
            });
        })
        .then(html => {
            const $ = cheerio.load(html);
            const summaryContainer = $('.speedometerWrapper-DPgs-R4s.summary-DPgs-R4s');

            summaryContainer.each(function () {
                const buyRating = $(this).find('.speedometerSignal-DPgs-R4s').text();
                console.log(ticker + ": " + buyRating);
                emailObject[ticker] = buyRating;
                console.log(emailObject);

        
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