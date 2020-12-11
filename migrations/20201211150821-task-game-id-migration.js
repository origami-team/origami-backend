const ObjectId = require("mongodb").ObjectID;

module.exports = {
  async up(db, client) {
    const tracks = await db.collection("tracks").find({}).toArray();
    const operations = tracks.map(async (track) => {
      const game = await db
        .collection("games")
        .findOne({ _id: ObjectId(track.game) });

      if (game != undefined && game != null) {
        return db.collection("tracks").updateOne(
          { _id: track._id },
          {
            $set: {
              game: game._id,
            },
          }
        );
      }

      console.log("could not find game ", game);

      return db.collection("tracks").findOne({ _id: track._id });
    });
    return Promise.all(operations);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
