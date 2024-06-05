import asyncHandler from "express-async-handler";

const users_get = asyncHandler(async (req, res) => {
  res.json({ userCount: 0, userPets: 0 });
});

const user_get = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.params.id,
      username: "specific user",
      email: "coolname@mail.com",
      pass_hash: "J3K!~@K!#@jk@PWQ",
    },
  });
});

const user_create = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: 1,
      username: "coolname",
      email: "coolname@mail.com",
      pass_hash: "J3K!~@K!#@jk@PWQ",
    },
  });
});

const user_update = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.params.id,
      username: "coolnewname",
      email: "coolnewname@mail.com",
      pass_hash: "aJ2(n!LKn2#b*",
    },
  });
});

const userController = { users_get, user_get, user_create, user_update };

export default userController;
