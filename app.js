var port = (process.env.VCAP_APP_PORT || 3000);
var express = require("express");
var sentiment = require("sentiment");
var twitter = require("ntwitter");

var twit = new twitter( {
    consumer_key: 'XViLTSsDhaZPzVEjW8DTng4uK',
    consumer_secret: 'jOYLMUZvBzOHqQukFXf4Lv82cuyTzTedAAgQ7ecRUNcHhh5nmR',
    access_token_key: '19363053-leKPl0dHWT8a5OY0d7tROZCVbMfkOcXdVKs3408MR',
    access_token_secret: '1oHoaFiCFnjK2CDj3IfJ4kWRhXlx1jN9AxXjqDJcBAzlN'
});


var app = express();


app.get('/hello', function(req, res) {
    res.send("Hello, world!");
});


app.get('/twitterCheck', function (req, res) {
    twit.verifyCredentials(function (error, data) {
        if (error) {
            res.send("Error connecting to Twitter: " + error);
        } else {
            res.send("Hello, " + data.name + ".  I am in your twitters.");            
        }
    });
});

app.get('/watchTwitter', function (req, res) {
    var stream;
    var testTweetCount = 0;
    var phrase = 'bjp';
    twit.verifyCredentials(function (error, data) {
        if (error) {
            res.send("Error connecting to Twitter: " + error);
        }
        stream = twit.stream('statuses/filter', {
            'track': phrase
        }, function (stream) {
            res.send("Monitoring Twitter for \'" + phrase 
                + "\'...  Logging Twitter traffic.");
            stream.on('data', function (data) {
                testTweetCount++;
                // Update the console every 10 analyzed tweets
                if (testTweetCount % 10 === 0) {
                    console.log("Tweet #" + testTweetCount + ":  " + data.text);
                }
            });
        });
    });
});

app.get('/testSentiment',
        function (req, res) {
            var response = "<HEAD>" +
                "<title>Twitter Sentiment Analysis</title>\n" +
                "</HEAD>\n" +
                "<BODY>\n" +
                "<P>\n" +
                "This is Sentiment Analysis client.\n  " +   
                "</P>\n" +
                "<FORM action=\"/testSentiment\" method=\"get\">\n" +
                "<P>\n" +
                "Enter text for sentiment analysis: <INPUT type=\"text\" name=\"phrase\"><BR><BR\>" +
                "<INPUT type=\"submit\" value=\"Query Sentiment Server\">\n" +
                "</P>\n" +
                "</FORM>\n" +
                "</BODY>";
            var phrase = req.query.phrase;
            if (!phrase) {
                res.send(response);
            } else {
                sentiment(phrase, function (err, result) {
                    response = 'Sentiment(' + phrase + ') === ' + result.score;
                    res.send(response);
                });
            }
        });

app.listen(port);
console.log("Server listening on port " + port);
