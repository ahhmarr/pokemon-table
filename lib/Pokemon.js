var mongoose=require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/pokemon');
var Schema=mongoose.Schema;

var PokemonSchema= new Schema({
	id : Number,
	name : String
});
var Pokemon=mongoose.model('Pokemon',PokemonSchema);

module.exports=Pokemon;

