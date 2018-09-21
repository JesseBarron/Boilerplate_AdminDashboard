require('dotenv').config();
const bcrypt = require("bcrypt");
const { db } = require("../config/mongo");
const { User } = require("../models/User");
const { Address } = require("../models/Address");
const { Coupon } = require("../models/Coupon");

const faker = require("faker");



const generateUsers = async (num) => {
  const fakeUsers = [
    {
      firstName: "Jesse",
      lastName: 'B',
      email: "jb@jb.com",
      password: await bcrypt.hash('123', 12),
      role: "SuperAdmin"
    }
  ]
  for (let i = 0; i < num; i++) {
    let tempUser = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: await bcrypt.hash('123', 12),
      role: "User"
    }
    fakeUsers.push(tempUser);
  }
  try {
    return await User.insertMany(fakeUsers);
  } catch (err) {
    console.log(err);
  }
}

////////////////// Generate Addresses /////////////////////////

const generateAddresses = async (num) => {
  const fakeAddresses = [];
  for (let i = 0; i < num; i++) {
    let tempAddress = {
      addressType: (i % 2) ? "Billing" : "NonBilling",
      addressLine: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      postal: faker.address.zipCode('#####')
    }
    fakeAddresses.push(tempAddress);
  }
  try {
    const addresses = await Address.create(fakeAddresses);
    await updateUserAddress(addresses);
    return addresses;
  } catch (err) {
    console.log(err)
  }
}

const updateUserAddress = async (addresses) => {
  try {
    const users = await User.find().then();
    const updatedUsers = [];
    for(let i = 0; i < addresses.length; i++) {
      let updatedUser = await User.findOneAndUpdate(
        { _id: users[i]._id },
        { $push: { addresses: addresses[i]._id } }
      ).exec()
    }
  } catch (err) {
    console.log(err)
  }
}

///////////// END of Generate Addresses /////////////////////



////////////// Generate coupons /////////////////////////

const generateCoupons = async (num) => {
  const fakeCoupons = [];
  for(let i = 0; i < num; i++) {
    let tempCoupon = {
      title: faker.commerce.productName(),
      description: faker.commerce.productAdjective(),
      thumbnail: faker.image.food(),
      active: (i % 2) ? true : false
    }
    fakeCoupons.push(tempCoupon);
  }
  try {
    const coupons = await Coupon.insertMany(fakeCoupons);
    await updateUserCoupons(coupons);
  } catch (err) {
    console.log(err);
  }
}

const updateUserCoupons = async (coupons) => {
  const couponIds = coupons.map(el => el._id);
  try {
    const users = await User.find().exec();
    for(let i = 0; i < users.length; i ++) {
     const updatedUser = await User.findOneAndUpdate(
        { _id: users[i]._id },
        { $push: { allCoupons: {
          $each: couponIds
        }}}).exec();
    }
  } catch (err) {
    console.log(err);
  }
}

const seed = async () => {
  try {
    let dots = "."
    setInterval(() => {
      const message = "Hold Up"
      if(dots.length > 20) {
        dots = "."
      }
      console.log(message + dots)
      dots += "."
    }, 1000)
    await db.dropDatabase();
    await generateUsers(20);
    await generateAddresses(20);
    await generateCoupons(4);
  } catch (err) {
    console.log(err);
  }
}

seed()
  .then(ok => {
    console.log("Done.");
    process.exit(0);
  })