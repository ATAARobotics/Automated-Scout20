const express = require('express');

var app = express();
//Views

app.set('view engine', 'pug');

const addView = (path, view, dataFunction) => {
    app.get(path, async (req, res) => {
        var data = await dataFunction(req);
        res.render(view, data);
    });
};

app.use(express.static('static'));

addView('/', 'index', async (req) => {
    return 
});

app.listen(process.env.PORT || 6082);

console.log(`Server on localhost:${process.env.PORT || 6082}`);