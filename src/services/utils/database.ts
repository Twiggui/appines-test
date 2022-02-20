const mongoose = require("mongoose");

export const mongoConnect = async () => {
  let url: string = "";
  if (process.env.NODE_ENV === "docker") {
    url =
      "mongodb://appines-data-mongodb:27017/appines?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
  } else {
    url =
      "mongodb://localhost:27017/appines?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
  }

  // const options = {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  // };

  const connection = await mongoose.createConnection(url);

  return connection;
};
