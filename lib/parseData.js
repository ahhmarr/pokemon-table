var Q=require('q');
var unirest=require('unirest');
var cheerio=require('cheerio');
var _ =require('underscore');
var invent = require('./invent');

function read(req)
{
	var defer=Q.defer();
	var json=req.body.json;
	if(typeof json !=='object')
		json=JSON.parse(json);
	var pokemons=json.pokemon;
	var newJSON=[];
	pokemons.map(function(obj,index)
	{
		getDetails(obj.pokemonID)
				.then(function(pokemon)
				{
					var candy=getCandy(json.candy,obj.pokemonID);
					newJSON.push({
						id : obj.pokemonID,
						cp : obj.cp,
						perfection : obj.perfection,
						name : pokemon,
						img : ('000'+obj.pokemonID).substr(-3)+'.png',
						candy : candy
					});
					if(newJSON.length===pokemons.length){
						defer.resolve({
								lists: newJSON,
								inventory:json.inventory
						});
					}
				}).catch(function(err)
				{
					defer.reject(err);
				})
	})
	return defer.promise;
}
function getCandy(candies,pokemonID)
{
	var candy=_.find(candies,function(el)
	{
		return el.familyID==pokemonID;	
	});
	return candy?candy:false;
}
function getDetails(id)
{

	var url='http://www.pokemon.com/us/pokedex/'+id;
	var defer=Q.defer();
	unirest.get(url)
			.send()
			.end(function(resp)
			{
				if(resp.status!==200){
					defer.reject('Error');
					return;
				}
				var $=cheerio.load(resp.body);
				var name=$('title').html();
					name=name.split('|')[0];
				defer.resolve(name);
				
			})
	return defer.promise;
}
function addInventoryDetails(inventories)
{
	return _.map(inventories,function(obj)
	{
		return invent.search(obj.itemID)
					.then(function(obj){
						return obj;
					});
	})
}
module.exports={
	read :read ,
	getDetails : getDetails
};