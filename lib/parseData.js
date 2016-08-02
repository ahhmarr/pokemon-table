var Q=require('q');
var unirest=require('unirest');

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
						img : ('000'+obj.pokemonID).substr(-3)+'.png'
					});
					if(newJSON.length===pokemons.length)
						defer.resolve(newJSON);
				}).catch(function(err)
				{
					defer.reject(err);
				})
	})
	return defer.promise;
}
function getDetails(id)
{

	var url='http://pokeapi.co/api/v2/pokemon/'+id;
	console.log(url);
	var defer=Q.defer();
	unirest.get(url)
			.send()
			.end(function(resp)
			{
				if(resp.status!==200)
					defer.reject('Error');
				else
					defer.resolve(resp.body);
			})
	return defer.promise;
}

module.exports={
	read :read ,
	getDetails : getDetails
};