module.exports = {
 	applicationPort : 8082,
	database  : function(){
		if(process.env.ENVIRONMENT){

			var opsworks = require('./../opsworks');
			var opsWorksDB = opsworks.db;
			var rdsConnection = {
				host : opsWorksDB.host,
				port : opsWorksDB.port,
				database: opsWorksDB.database,
				user : opsWorksDB.username,
				password : opsWorksDB.password
				}; 
			return rdsConnection;
			} 
		else 
			{
  			var local = require('./../config/local');
			var localConnection = local.db;
			return localConnection;
			}
	},
	awsVariables: function(){
		if(process.env.ENVIORNMENT){
			var variables = {
				bucket: process.env.S3BUCKET
			}
			return variables;
		} else {
			var local = require('./../config/local');
			return local.awsVariables;
		}
	}
}	 