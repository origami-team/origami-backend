const express = require("express");
const mongoose = require("mongoose");
const { map } = require("underscore");

const Game = require("../../models/game");
const task = require("../../models/task");

const getAllGamesWithLocs = async (req, res) => {
    try {
        let result = await Game.find().select("-user");
        /*
         * using Oject asssign to get coords of each game by checking whether the game consist of nav task
         * then assign nav coords as game coords
         * this coords will be used to show game loc on map
         */

        let resultWithCoords = []

        // the Execution will not go forward until all the promises are resolved.
        await Promise.all(
            //result.map(async (item, index) => {
            result.map(async (item) => {
                //await asyncFunction(item)
                let counter = 0;
                //console.log("index: ", index)
                for (let task of item.tasks) {
                    counter += 1;
                    if (task.category == "nav" & task.answer.position != undefined) {
                        //Object.assign(item, { coords: task.answer.position.geometry.coordinates });
                        resultWithCoords.push({
                            _id: item._id,
                            name: item.name,
                            place: item.place,
                            isVRWorld: item.isVRWorld,
                            isCuratedGame: item.isCuratedGame,
                            coords: task.answer.position.geometry.coordinates,
                            task_num: item.tasks.length
                        })
                        //console.log("0_task.answer.position.geometry.type: ", task.answer.position.geometry.coordinates);
                        break;
                    }

                    // insert games with unknown locs with undefined coords
                    if (item.tasks.length == counter) {
                        //Object.assign(item, { coords: undefined });
                        resultWithCoords.push({
                            _id: item._id,
                            name: item.name,
                            place: item.place,
                            isVRWorld: item.isVRWorld,
                            isCuratedGame: item.isCuratedGame,
                            coords: undefined,
                            task_num: item.tasks.length
                        })
                    }
                }
            })
        )

        return res.status(200).send({
            message: "Games with locs found successfully.",
            content: resultWithCoords,
        });
        // }
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports = {
    getAllGamesWithLocs,
};
