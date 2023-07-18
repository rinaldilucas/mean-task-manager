
class DatabaseConfig {
  url = 'mongodb://127.0.0.1:27017/meantemplatedb';
  urlProd = 'mongodb://host:password@schema:port/collection';
}

export default new DatabaseConfig();
