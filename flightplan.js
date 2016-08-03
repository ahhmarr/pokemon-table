var plan=require('flightplan');
var gitURL='git@github.com:ahhmarr/pokemon-table.git';
var folderName='pokemon_table';
plan.target('production',[
	{
		host : '139.59.6.168',
		username : 'deploy',
		agent : process.env.SSH_AUTH_SOCK
	}
]);
var tmpDir=folderName+''+new Date().getTime();

plan.local(function(local)
{
	local.log('====started planning===');
	local.log('pushing master to remote ');
	var err=local.exec('git push origin master');
});

plan.remote(function(remote)
{
	remote.failsafe();
	remote.log('===Starting server deployment=====');
	var notExists=remote.exec('cd '+folderName+'');
	if(notExists){
		remote.exec('git clone '+gitURL+' '+folderName);	
	}
	remote.exec('cd '+folderName+' && git pull origin master');
	remote.exec('cd '+folderName+' && npm install --production')
	remote.exec('cd '+folderName+' && bower install')
	var pmNotExists=remote.exec('cd '+folderName+' && pm2 reload '+folderName+' ');
	if(pmNotExists){
		remote.exec('cd '+folderName+' && pm2 start bin/www -n "'+folderName+'"');
	}
});