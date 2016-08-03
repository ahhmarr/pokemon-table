var fs=require('fs');
var  _ =require('underscore');
var Q=require('q');

function read(callback){
	var content=fs.readFile(__dirname+'/../public/javascripts/items.json','utf8',function(err,contents)
	{
		// console.log(contents);
		var json=JSON.parse(contents);
		if(typeof callback === 'function')
			callback(json)
	});
	
}
function readKey(json,id){
 // console.log(id);
 var obj=_.find(json.items,function(el)
 {
 	return el.value == id;
 });
 return obj;
}
function search(id){
	var defer=Q.defer();
	read(function(json)
	{
		if(typeof json!=='object'){
			defer.reject('Error');
			return;
		}
		var obj=readKey(json,id);
		if(!obj){
			defer.reject('not found');
			return;
		}
		// console.log(obj);
		defer.resolve({
			key : formatString(obj.key),
			id 	: obj.value
		});
	});
	return defer.promise;
}
function formatString(str){
	str=str.toLowerCase();
	str=str.replace(/_/g,' ');
	str=str.substr(5);
	return str;
}

function addInventoryName(json)
{
	var defer=Q.defer();
	var newInventories=_.map(json.inventory,function(inv)
	{
		return search(inv.itemID);
	})
	Q.all(newInventories).then(function(resp)
	{
		var newInventories=_.map(json.inventory,function(inv)
		{
			var o=_.find(resp,function(i){
				return inv.itemID==i.id;
			});
			if(o)
				inv.name=o.key;
			return inv;	
		});
		json.inventory=newInventories
		defer.resolve(json);
	});
	return defer.promise;
}
module.exports={
	search : search,
	addInventoryName : addInventoryName
};