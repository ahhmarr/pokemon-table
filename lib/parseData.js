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
					newJSON.push({
						id : obj.pokemonID,
						cp : obj.cp,
						perfection : obj.perfection,
						name : pokemon.name,
						img : ('000'+obj.pokemonID).substr(-3)+'.png',
					});
					if(newJSON.length===pokemons.length){
						getCandyWithPokemonName(json.candy)
						.then(function(candies)
						{
							defer.resolve({
								lists: newJSON,
								inventory:json.inventory,
								candies : candies
							});
						})
					}
					
				}).catch(function(err)
				{
					defer.reject(err);
				})
	})
	return defer.promise;
}
function getCandyWithPokemonName(candies)
{
	var defer=Q.defer();
	var candyPromises=_.map(candies,function(el)
	{
		return getDetails(el.familyID);
	});

	Q.all(candyPromises)
	 .then(function(resp)
	 {
	 	var candiesWithName=_.map(candies,function(c)
	 	{
	 		var obj=_.find(resp,function(r)
	 		{
	 			return (c.familyID==r.id);
	 		});
	 		if(obj)
	 			c.name=obj.name;
	 		return c;
	 	});
	 	defer.resolve(candiesWithName);
	 }).catch(function(err)
	 {
	 	defer.reject(err);
	 });
	return defer.promise;
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
				defer.resolve({id:id,name:name});
				
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