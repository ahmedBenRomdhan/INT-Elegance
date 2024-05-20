const db = require("../models");
const roomModel = db.room;
const meetingModel = db.meeting;
const { Op } = require("sequelize");

/* GET All Rooms */
const getAllRooms = async (req, res) => {
  let roomListResponse = await roomModel.findAll();
  res.status(200).send(roomListResponse);
};

const getAvailableRooms = async (req, res) => {
  const { startDate, endDate, startTime, endTime } = req.query;
  try {
    const allRooms = await roomModel.findAll();
    console.log(startDate,endDate,startTime,endTime);
    const meetings = await meetingModel.findAll({
      where: {
        start: {
          [Op.lte]: startDate,
        },
        end: {
          [Op.gte]: endDate,
        },
        endTime: {
          [Op.gt]: startTime,
        },
        startTime: {
          [Op.lt]: endTime,
        },
      }, 
    });
    console.log("mm",meetings);
    const roomsWithMeetings = meetings.map((meeting) => meeting.roomId);
    const availableRooms = allRooms.filter(
      (room) => !roomsWithMeetings.includes(room.id)
    );

    res.status(200).json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
};
