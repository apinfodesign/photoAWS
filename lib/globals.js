module.exports = {
 	applicationPort : 80,
	database  : function()
	{
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
		else {
  			var local = require('./../config/local');
			var localConnection = local.db;
			return localConnection;
			}
	}
}	 