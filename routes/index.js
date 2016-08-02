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
        id: 50,
        name: 'diglett',
        cp: 68,
        perfection: 77.525033190408635,
        img: '050.png'
    }, {
        id: 120,
        name: 'staryu',
        cp: 93,
        perfection: 80.289941327312008,
        img: '120.png'
    }];
	 res.render('pokemon/table', {
	            layout: 'master',
	            pokemons: json
	        });
});
module.exports = router;