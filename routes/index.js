var express = require('express');
var router = express.Router();
var parse = require('../lib/parseData');
var hbs=require('hbs');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        layout: 'master'
    });
});

router.post('/generate', function(req, res, next) {
    hbs.registerHelper("inc",function(value,option)
        {
            return parseInt(value)+1
        })
    parse.read(req)
        .then(function(json) {
            console.log(json);
            res.render('pokemon/table', {
                layout: 'master',
                pokemons: json
            });
        });
});
router.get('/generate-mock', function(req, res, next) {
	hbs.registerHelper("inc",function(value,option)
		{
			return parseInt(value)+1
		})
    var json = [{
        id: 1,
        name: 'bulbasaur',
        cp: 23,
        perfection: 100,
        img: '001.png'
    }, {
        id: 2,
        name: 'ivysaur',
        cp: 22,
        perfection: 110,
        img: '002.png'
    }];
	 res.render('pokemon/table', {
	            layout: 'master',
	            pokemons: json
	        });
});
module.exports = router;