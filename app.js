var bodyParser   = require("body-parser"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose         = require("mongoose"),
express          = require("express"),
rpromise         = require('request-promise'),
request          = require("request"),
app              = express();

//console.log(process.env.DATABASEURL);

//App Config
var url = process.env.DATABASEURL || "mongodb://localhost/restfull_web_app";
mongoose.connect(url, {useMongoClient: true});
//mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
//mongoose.connect("mongodb://Billy:billias@ds127126.mlab.com:27126/movieblog", {useMongoClient: true});

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extented: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));


//Mongoose Config
var MovieSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//Model config(I compiled it itno a model)
var Movie = mongoose.model("Movie", MovieSchema);

/*Movie.create({
    title: "Test Web App",
    image: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=751&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
    body: "I like this Movie"
});*/

app.get("/", function(req, res) {
    res.redirect("/movies");
});

//INDEX PAGE
app.get("/movies", function(req, res) {
    Movie.find({}, function(err, movies) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {movies: movies});
        }
    });
});

//New Route(this route shows me the page with the form)
app.get("/movies/new", function(req, res) {
    res.render("new");
});

//Create Route
app.post("/movies", function(req, res) {
    req.body.movie.body = req.sanitize(req.body.movie.body)//Here i am taking the data from the form and sanitize them
    //create movie
    Movie.create(req.body.movie, function(err, newMovie) {
        if(err) {
            res.render("new");
        } else {
            res.redirect("/movies");
        }
    });
});

//Show Page
app.get("/movies/:id", function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if(err) {
            res.redirect("/movies");
        } else {
            res.render("show", {movie: foundMovie});
        }
    });
});

//Edit Route
app.get("/movies/:id/edit", function(req, res) {
    Movie.findById(req.params.id, function(err, foundMovie) {
        if(err) {
            res.redirect("/movies");
        } else {
            res.render("edit", {movie: foundMovie});
        }
    });
});

//UPTADE ROUTE
app.put("/movies/:id", function(req, res) {
    req.body.movie.body = req.sanitize(req.body.movie.body)
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updateMovie) {
        if(err) {
            res.redirect("/movies");//redirects to index
        } else {
            res.redirect("/movies/" + req.params.id);//Redirects to show page
        }
    });
});

//Delete Movie
app.delete("/movie/:id", function(req, res) {
    Movie.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/movies");
        } else {
            res.redirect("/movies");
        }
    });
});

//Search Page
app.get("/search", function(req, res) {
    res.render("search");
});

//Movie results
app.get("/results", function(req, res) {
   
//var url =  ["http://www.omdbapi.com/?s=california&page=1&apikey=2d2ca1ba","http://www.omdbapi.com/?s=california&page=2&apikey=2d2ca1ba",
    //"http://www.omdbapi.com/?s=california&page=3&apikey=2d2ca1ba", "http://www.omdbapi.com/?s=california&page=4&apikey=2d2ca1ba"];
  

    var query = req.query.search;
    var page = "&page=";
    var numPages = 1
    var url = "http://www.omdbapi.com/?s=" + query + page + numPages;
    var key = "&apikey=2d2ca1ba"
    var makeReq = url + key;
    request(makeReq, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            //res.send(results["search"][0]);
           
            res.render("results", {data: data});
            //console.log(data);
        }
    });
    
});

app.get("/plot/:id", function(req, res) {
    var query = req.params.id;//I am using req.params instead of req.query because i am taking the id from the body not from the query string
    
    var plot = "&plot=full";
    var url = "http://www.omdbapi.com/?i=" + query + plot;
    var key = "&apikey=2d2ca1ba";
    request(url + key, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            
           res.render("plot", {data: data})
        }
    });
});

/*app.get("/results", function(req, res) {
    var query = req.query.imdbID;
    var url = "http://www.omdbapi.com/?i=" + query;
    var key = "&apikey=2d2ca1ba";
    
     request(url + key, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            //res.send(results["search"][0]);
            res.render("results", {data: data});
        }
    });
})*/



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The Web App Server has started!");
});