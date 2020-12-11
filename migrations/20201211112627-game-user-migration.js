module.exports = {
  async up(db, client) {
    const user = await db
      .collection("users")
      .findOne({ email: "hello@felixerdmann.com" });
    console.log(user);
    return db.collection("games").updateMany({}, { $set: { user: user._id } });
  },

  async down(db, client) {
    return db.collection("games").updateMany({}, { $unset: { user: null } });
  },
};
