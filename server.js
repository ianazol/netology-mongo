const express    = require("express");
const bodyParser = require("body-parser");
const contacts   = require("./contacts");
const app        = express();
const port       = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

app.get("/contacts", contacts.get);
app.get("/contacts/:id", contacts.get);
app.post("/contacts", contacts.add);
app.put("/contacts/:id", contacts.update);
app.delete("/contacts/:id", contacts.remove);

app.use(function(req, res){
    res.status(404).send('404 Not Found');
});

app.use(function(err, req, res, next){
    console.dir(err);
    res.status(500).send('500 Server Error');
});

app.listen(port);