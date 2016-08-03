var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/pokemon');
var Schema=mongoose.Schema;
var ListSchema= new Schema({
	lists : Object,
	inventory : Object,
	candies: Array,
	created_at : Date
});
var List=mongoose.model('List',ListSchema);

module.exports=List;

