import bcrypt from "bcrypt";

const password = "password";
const hash = bcrypt.hashSync(password, 10);

const userSeed = [
  {
    _id: "6186e80aa8a6d3abae02d434",
    email: "favour@gmail.com",
    password: hash,
    firstName: "Favour",
    lastName: "Alabi",
    phone: "+2348100581870",
    photo: "https://res.cloudinary.com/obioflagos/image/upload/v1636232913/az4buhqn0bqci4zpls2e.jpg",
    role: "admin",
    created_at: "2021-11-06T20:39:38.502Z",
    updated_at: "2021-11-06T21:26:25.182Z",
  },
  {
    _id: "626a930263c8523170450619",
    email: "donald@gmail.com",
    password: hash,
    firstName: "Donald",
    lastName: "Agbakoba",
    phone: "+2348100581890",
    photo: "https://res.cloudinary.com/obioflagos/image/upload/v1636232913/az4buhqn0bqci4zpls2e.jpg",
    role: "user",
    created_at: "2021-11-06T20:39:38.502Z",
    updated_at: "2021-11-06T21:26:25.182Z",
  }

];

export default userSeed;
