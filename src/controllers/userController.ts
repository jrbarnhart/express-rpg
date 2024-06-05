import asyncHandler from "express-async-handler";

const users_get = asyncHandler(async (req, res) => {
  res.json({ userCount: 0, userPets: 0 });
});

export default { users_get };
