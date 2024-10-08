const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  customerName: { type: String },
  contactNumber: { type: Number },
  emailAddress: { type: String },
  pincode: { type: Number },
  address: { type: String },
  city: { type: String },
  dist: { type: String }, 
}); 

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
