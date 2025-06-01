const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

const initDB = () => {
  Listing.deleteMany({})
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "683c9d9dd160780e738b469e",
  }));
  Listing.insertMany(initData.data)
    .then((res) => console.log("Database is Initialized"))
    .catch((err) => console.log(err));
};
initDB();
