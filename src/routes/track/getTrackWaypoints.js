const Track = require("../../models/track");

const getTrackWaypoints = async (req, res) => {
  try {
    let id = req.params.id;
    let trackData = await Track.findOne({ _id: id });
    let trackWaypoints = trackData.waypoints;

    let extractedWaypoints = [];

    // check if there're enough points
    /* if (trackWaypoints.length > 5) {
    } else {
      // ToDo: ---
      console.log("no enough waypionts to show!!");
    } */
    let taskNumbers = [];
    await Promise.all(
      // Add tracksCount property
      // ToDo: make each task no in a separate object
      
      trackWaypoints.map(async (waypoint) => {

        if(waypoint.position){

          if(taskNumbers.length == 0 && waypoint.taskNo || taskNumbers[taskNumbers.length - 1] != waypoint.taskNo){
            taskNumbers.push(waypoint.taskNo);
          }

          extractedWaypoints.push({
            task_no: waypoint.taskNo,
            latitude: waypoint.position.coords.latitude,
            longitude: waypoint.position.coords.longitude,
            timestamp: waypoint.timestamp,
            compassHeading: waypoint.compassHeading,
          });

        }
      })
    );

    return res.status(200).send({
      message: "Track found successfully.",
      content: {taskNumbers: taskNumbers ,waypoints: extractedWaypoints},
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports = {
  getTrackWaypoints,
};
