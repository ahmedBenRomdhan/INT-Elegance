const db = require("../models/index");
const meetingModel = db.meeting;
const userModel = db.user;
const roomModel = db.room
const emailNotifications = require("../helpers/emailNotifications");
const { Op } = require("sequelize");

const getUserInfoApi = async (userId) => {
  const response = await userModel.findByPk(userId);
  return response
};

const getRoomInfo = async (roomId) => {
  const response = await roomModel.findByPk(roomId);
  return response.name;
};

const addMeeting = async (req, res) => {
  const {
    title,
    roomId,
    start,
    end,
    startTime,
    endTime,
    createdBy,
    users,
    description,
  } = req.body;
  try {
    const isMeetingExist = await meetingModel.findOne({
      where: { title: title },
    });
    if (isMeetingExist) {
      return res
        .status(422)
        .send({ type: "Failed", message: "La réunion existe déjà" });
    }

    const isUserExist = await userModel.findByPk(createdBy);
    if (!isUserExist) {
      return res
        .status(404)
        .send({ type: "Failed", message: "User not found" });
    }

    const meetingObj = {
      title,
      roomId,
      start,
      end,
      startTime,
      endTime,
      createdBy,
      description,
    };

    const meeting = await meetingModel.create(meetingObj);

    if (users && users.length > 0) {
      await meeting.addUser(users);
      const meetingParticipants = [];
      const userInfo = await getUserInfoApi(meeting.createdBy);

      for (const element of users) {
        const participant = await getUserInfoApi(element);
        meetingParticipants.push(participant);
      }
      const roomName = await getRoomInfo(meeting.roomId);

      emailNotifications.sendInvitation(
        userInfo.firstName,
        userInfo.lastName,
        meetingParticipants,
        meeting,
        roomName
      );
    }

    res.status(201).send({
      type: "Success",
      message: "Meeting Added Successfully",
      results: meeting,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET All Meetings */
const getAllMeeting = async (req, res) => {
  try {
    const meetingList = await meetingModel.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: userModel,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "department",
            "position",
            "image",
          ],
          through: {
            attributes: [],
          },
          as: "users",
        },
        {
          model: roomModel,
          as: "room",
        }
      ],
    });

    const enrichedMeetingList = await Promise.all(
      meetingList.map(async (meeting) => {
        const userInfo = await getUserInfoApi(meeting.createdBy);
        if (userInfo) {
          meeting.dataValues.creator = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            department: userInfo.department,
            position: userInfo.position,
            image: userInfo.image,
          };
        }
        return meeting;
      })
    );

    res.status(200).send(enrichedMeetingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE Meeting By Id */
const updateMeeting = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const {
      title,
      roomId,
      start,
      end,
      startTime,
      endTime,
      createdBy,
      users,
      description,
    } = req.body;

    const meeting = await meetingModel.findByPk(meetingId, {
      include: [
        {
          model: userModel,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
          through: {
            attributes: [],
          },
          as: "users",
        },
      ],
    });
    if (!meeting) {
      return res.status(404).send({
        type: "Failed",
        message: "Unable to Find the Meeting",
      });
    }

    const isUserExist = await userModel.findByPk(createdBy);
    if (!isUserExist) {
      return res
        .status(404)
        .send({ type: "Failed", message: "User not found" });
    }

    meeting.title = title;
    meeting.roomId = roomId;
    meeting.start = start;
    meeting.end = end;
    meeting.startTime = startTime;
    meeting.endTime = endTime;
    meeting.description = description;

    if (users) {
      const existingUsers = meeting.users.map((p) => p.id);
      const newUsers = users.map((p) => p);

      const UsersToDelete = existingUsers.filter((p) => !newUsers.includes(p));
      await meeting.removeUser(UsersToDelete);
      const UsersToAdd = users.filter(
        (p) => !existingUsers.includes(p.id)
      );
      await meeting.addUser(UsersToAdd);
    }
    await meeting.save();

    return res.status(200).send({
      type: "Success",
      message: "Meeting Updated Successfully !",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteMeeting = async (req, res) => {
  const meetingId = req.params.id;
  try {
    const meeting = await meetingModel.findByPk(meetingId, {
      include: [
        {
          model: userModel,
          as: "users",
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!meeting) {
      return res.status(404).send("Meeting not found");
    }
    const usersToDelete = meeting.users.map((p) => p.id);
    await meeting.removeUser(usersToDelete);

    await db.usermeeting.destroy({
      where: { id: meetingId },
    });

    await meeting.destroy();

    if (usersToDelete && usersToDelete.length > 0) {
      const meetingParticipants = [];
      const userInfo = await getUserInfoApi(meeting.createdBy);

      for (const element of usersToDelete) {
        const participant = await getUserInfoApi(element);
        meetingParticipants.push(participant);
      }

      emailNotifications.SendCanceledMeeting(
        userInfo.firstName,
        userInfo.lastName,
        meetingParticipants,
        meeting
      );
    }

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Incoming Meetings */
const getIncomingMeetings = async (req, res) => {
  try {
    const today = new Date();

    const meetingList = await meetingModel.findAll({
      where: {
        end: {
          [Op.gte]: today,
        },
      },
      order: [["start", "ASC"]],
      include: [
        {
          model: userModel,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "department",
            "position",
            "image",
          ],
          through: {
            attributes: [],
          },
          as: "users",
        },
        {
          model: roomModel,
          as: "room",
        }
      ],
    });

    const enrichedMeetingList = await Promise.all(
      meetingList.map(async (meeting) => {
        const userInfo = await getUserInfoApi(meeting.createdBy);
        if (userInfo) {
          meeting.dataValues.creator = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            department: userInfo.department,
            position: userInfo.position,
            image: userInfo.image,
          };
        }
        return meeting;
      })
    );
    res.status(200).send(enrichedMeetingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMeeting,
  getAllMeeting,
  updateMeeting,
  deleteMeeting,
  getIncomingMeetings,
  getUserInfoApi,
  getRoomInfo
};
