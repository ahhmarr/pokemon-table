var express = require('express');
var router = express.Router();
var parse = require('../lib/parseData');
var hbs=require('hbs');
var List=require('../lib/DB');
var invent=require('../lib/invent');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        layout: 'master'
    });
});

router.post('/generate', function(req, res, next) {
    
    parse.read(req)
        .then(invent.addInventoryName)
        .then(function(json){
            console.log(json.lists);
            var l=new List({
                lists : json.lists,
                inventory : json.inventory,
                candies :json.candies,
                created_at : new Date(),
            }).save(function(resp,obj)
            {
                 res.redirect('/list/'+obj._id);
            });
        })
        .catch(function(err)
        {
            console.log(err);
            res.end(err);
        });
});

router.get('/list/:id', function(req, res, next) {
    var hideInvetory=req.query.hinvent;
    var hideCandy=req.query.hican;
    console.log(hideCandy);
    var ObjectId=require('mongoose').Types.ObjectId;
    var list=List.findOne({
        _id : new ObjectId(req.param('id'))
    }).exec(function(resp,list)
    {
        res.render('pokemon/table', {
                layout: 'master',
                pokemons: list.lists,
                invents : list.inventory,
                candies : list.candies,
                hideInvetory : hideInvetory,
                hideCandy : hideCandy
            });
    });
});
router.get('/items/:id', function(req, res, next) {
    var id=req.param('id');
    invent.search(id)
            .then(function(resp)
            {
                console.log(resp);
            }).catch(function(err)
            {
                console.log(err);
            });
});
hbs.registerHelper("inc",function(value,option){
    return parseInt(value)+1
});
hbs.registerHelper("round",function(value,option){
    return parseFloat(value).toFixed(2);
});
hbs.registerHelper("imgURL",function(value,option){
    console.log(value);
    return ('000'+value).substr(-3)+'.png';
});
hbs.registerHelper("inventcondition",function(v1,v2,option){

console.log(v2);
    if(v1 && !v2){
        return option.fn(this);
    }
    else{
        option.inverse(this);
    }
    // option.fn(v1);
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
    // console.log(l);
    
});
module.exports = router;