const express = require ("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require("request");
const axios = require("axios");
const logger = require("logger");

const db = require ("./models");
const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.engine('hbs', exphbs({defaultLayout: 'main', layoutsDir: 'views/', extname: '.hbs'}));

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
	res.render('index', {layout:'main'});
});

app.get("/saved", function(req, res){
    db.Article.find({"saved": true}).populate("note").exec(function(error, articles){
        var hbsObject = {
            article: articles
        };
        res.render ("saved", hbsObject);
    });
});

app.get("/scrape", function(req,res){
    axios.get("https://www.huffingtonpost.ca/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("ul li h3").each(function(i, element){
            var result = {};

            result.title = $(this)
            .children("a")
            .html();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                return res.json(err);
            });
        });
        res.redirect("/");
 });
});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
        })
    .catch(function(err){
        res.json(err);
    });
});

app.get('/articles/:id', function(req, res){
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/saved/:id", function(req, res){
    db.Article.findOneAndUpdate({ "_id": req.params.id }, {
        "saved": true})
        .exec(function(err, doc){
            if(err){
                console.log(err);
            }
            else{
                res.send(doc);
            }
        });
    });

app.post("/articles/delete/:id", function(req, res){
    db.Article.findOneAndUpdate({ "_id": req.params.id},
    {"saved": false})
    .exec(function(err, doc){
        if (err) {
            console.log(err);
        }
        else{
            res.send(doc);
        }
    });
});
app.listen(3000, () => {
    console.log('Scrap app is running → PORT 3000');
});
