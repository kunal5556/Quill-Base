require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file");
    process.exit(1);
  }

  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    console.log(`Admin account already exists: ${email}`);
  } else {
    await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: "admin" });
    console.log(`Admin account created: ${email}`);
  }

  await mongoose.connection.close();
};

seedAdmin().catch((error) => {
  console.error(`Admin seeding failed: ${error.message}`);
  process.exit(1);
});
