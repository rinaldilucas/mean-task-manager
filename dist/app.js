"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _express = _interopRequireDefault(require("express"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _path = _interopRequireDefault(require("path"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _mongodb = _interopRequireDefault(require("./config/mongodb.config"));
var _swagger = _interopRequireDefault(require("./swagger.json"));
var _auth = _interopRequireDefault(require("./routes/auth.routes"));
var _category = _interopRequireDefault(require("./routes/category.routes"));
var _task = _interopRequireDefault(require("./routes/task.routes"));
var _user = _interopRequireDefault(require("./routes/user.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Import routes

class App {
  constructor() {
    this.express = (0, _express.default)();
    this.middlewares();
    this.database();
    this.routes();
    _dotenv.default.config();
  }
  middlewares() {
    this.express.use(_bodyParser.default.json());
    this.express.use(_bodyParser.default.urlencoded({
      extended: false
    }));
    this.express.use((0, _cors.default)());
    this.express.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default));
    const args = process.argv;
    if (args.includes('--prod=true')) {
      this.express.use(_express.default.static(_path.default.join(__dirname, 'docs')));
      this.express.use('/', _express.default.static(_path.default.join(__dirname, 'docs')));
    }
  }
  database() {
    const args = process.argv;
    let database;
    if (args.includes('--prod=true')) {
      database = _mongodb.default.urlProd;
      console.log('Using production connection string.');
    } else {
      database = _mongodb.default.url;
      console.log('Using local connection string.');
    }
    _mongoose.default.connect(database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }).then(() => console.log('Successfully connected to MongoDB.')).catch(error => {
      console.log(`Could not connect to MongoDB. Error: ${error}`);
      process.exit();
    });
  }
  routes() {
    this.express.use(_auth.default);
    this.express.use(_task.default);
    this.express.use(_user.default);
    this.express.use(_category.default);
  }
}
var _default = new App().express;
exports.default = _default;