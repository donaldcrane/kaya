import bcrypt from "bcrypt";

const password = "password";
const hash = bcrypt.hashSync(password, 10);

const cartSeed = [
  {
    _id: "632ccc226bb92ddb1a956878",
    email: "admin@admin.com",
    password: hash,
    firstName: "Kaya",
    lastName: "Admin",
    phone: "09035767891",
    active: true,
    role: "admin",
    createdAt: "2022-09-22T20:57:06.768Z",
    updatedAt: "2022-09-22T20:57:06.768Z",
    __v: 0
  },

];

export default cartSeed;
