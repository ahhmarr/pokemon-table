var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/pokemon');
var Schema=mongoose.Schema;
var Schema= new Schema({
	lists : Object,
	inventory : Object,
	created_at : Date
});
var List=mongoose.model('List',Schema);

module.exports=List;

