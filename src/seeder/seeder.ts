// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import models from '../models';
// import userSeed from './userSeed';
// import cartSeed from './cartSeed';
// import productSeed from './productSeed';

// dotenv.config();
// mongoose.connect(process.env.MONGO_URL as string, async () => {
//   console.log('connected to db');
//   userSeed.map(async (user) => {
//     await models.User.findByIdAndUpdate({ _id: user._id }, user, { upsert: true });
//   });

//   cartSeed.map(async (cart) => {
//     await models.Cart.findByIdAndUpdate({ _id: cart._id }, cart, { upsert: true });
//   });

//   productSeed.map(async (product) => {
//     await models.Product.findByIdAndUpdate({ _id: product._id }, product, { upsert: true });
//   });
//   console.log('seeding completed...');
// });

//   // mongoose.connection.close()
