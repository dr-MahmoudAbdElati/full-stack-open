require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  if (!url) {
    throw new Error("MONGODB_URI is not defined");
  }

  console.log("connecting to", url);
  await mongoose.connect(url, {
    family: 4,
  });
  console.log("connected to MongoDB");
};

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);
Person.connectToDatabase = connectToDatabase;

module.exports = Person;
