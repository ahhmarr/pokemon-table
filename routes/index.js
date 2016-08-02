var express = require('express');
var router = express.Router();
var parse = require('../lib/parseData');
var hbs=require('hbs');
var List=require('../lib/DB');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        layout: 'master'
    });
});

router.post('/generate', function(req, res, next) {
    
    parse.read(req)
        .then(function(json) {
             var l=new List({
                lists : json,
                cerated_at : new Date()
            }).save(function(resp,obj)
            {
                 res.redirect('/list/'+obj._id);
            });
        }).catch(function(err)
        {
            res.end(err);
        });
});

router.get('/list/:id', function(req, res, next) {
    // console.log(req.param('id'));
    var ObjectId=require('mongoose').Types.ObjectId;
    var list=List.findOne({
        _id : new ObjectId(req.param('id'))
    }).exec(function(resp,list)
    {
        res.render('pokemon/table', {
                layout: 'master',
                pokemons: list.lists,
            });
    });
});
router.get('/generate-mock', function(req, res, next) {
	
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
    var l=new List({
        lists : json,
        cerated_at : new Date()
    }).save(function(resp,obj)
    {
         res.redirect('/list/'+obj._id);
    });
    console.log(l);
	
});
hbs.registerHelper("inc",function(value,option){
    return parseInt(value)+1
});
hbs.registerHelper("round",function(value,option){
    return parseFloat(value).toFixed(2);
});
module.exports = router;