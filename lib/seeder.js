var Pokemon=require('./Pokemon');
var _=require('underscore');
var Q=require('q');
var parse=require('./parseData')
function seed()
{
	var exists=Pokemon.findOne({id:720},function(err,obj)
	{
		if(!obj){
			seedToPokemon();
		}else{
			console.log('====POKEMON DB COMPLETE===');
		}
	});

}
function seedToPokemon()
{
	
	var maxID=Pokemon.findOne({},'id')
				.sort({id:-1})
				.exec().then(function(resp)
				{
					// var id=1;
					var id=(resp && resp.id) || 1
					fetchRangeAndSaveTODB(id)
				})
	return;
	
}
function fetchRangeAndSaveTODB(from,to){
	to=to || 721;
	console.log(from,to);
	_.map(_.range(from,to),function(ID)
	{
		parse.getDetails(ID).then(function(obj)
		{
			console.log(obj);

			new Pokemon(obj).save(function(err,resp){
				// console.log('error',err);
				console.log('resp',resp);
			})
		}).catch(function(err)
		{
			console.log(err);
		});
	});
	
}
module.exports={
	seed : seed
}