const Track = require("../../models/track");

const getTrackWaypointsEvents = async (req, res) => {
  try {
    let id = req.params.id;
    let track_Waypoints_events = await Track.findOne({ _id: id }).select("waypoints").select("events");

    return res.status(200).send({
      message: "Track found successfully.",
      content: track_Waypoints_events,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getTrackWaypointsEvents,
};
