
class DatabaseConfig {
  url = 'mongodb://127.0.0.1:27017/meantemplatedb';
  urlProd = process?.env?.MONGODB_HOST;
}

export default new DatabaseConfig();