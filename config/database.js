import mongoose from "mongoose";

class Connection {
  constructor() {
    const url = process.env.MONGODB_URI || `mongodb://localhost:27017/test`;
    try {
      mongoose.Promise = global.Promise;
      mongoose.set("useNewUrlParser", true);
      mongoose.set("useFindAndModify", false);
      mongoose.set("useCreateIndex", true);
      mongoose.set("useUnifiedTopology", true);
      mongoose.connect(url);
      console.log("Connection done with url", url);
    } catch (error) {
      console.log(`Database connection failed! ${error}`);
    }
  }
}

export default new Connection();
