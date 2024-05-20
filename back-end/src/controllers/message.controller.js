const db = require("../models");
const messageModel = db.message;
const userModel = db.user;
const conversationModel = db.conversation;
const userconversationModel = db.userconversation;
const { Op } = require("sequelize");
const notificationModel = db.notification
// const {io} = require('../app')
const io = require('socket.io-client')


const sendMessage = async (req, res) => {
  try {
    // console.log(socket)
    // console.log(req)
 
    // console.log(req.headers.authorization)
    // const token = req.headers.authorization.split(" ")[1]
    // console.log(token)
    // const socket = io('http://localhost:3000',{auth:{token:token}})
    const { conversationId, message_body, fileMetaData } = req.body;
   console.log("recieved metaData", fileMetaData)
    const sender = await userModel.findByPk(req.user.id);
    const conversation = await conversationModel.findByPk(conversationId);

    const conversationUsers = await userconversationModel.findAll({
      where:{
        conversationId: conversationId
      },
    })
    const user = await userModel.findByPk(conversationUsers[1].dataValues.userId)
    // console.log('convUsers',conversationUsers[1].dataValues)
    if (!sender || !conversation) {
      return res
        .status(404)
        .json({ error: "Sender or conversation not found" });
    }

    const message = await messageModel.create({
      message_body,
      senderId: req.user.id,
      fileMetadata: req.body.fileMetaData
    });
    // const notification = {
    //   from: req.user.firstName,
    //   subject: `${req.user.firstName} has sent you a message`,
    //   useravatar: req.user.image,
    //   treated: false,
    //   to: user.id
    // }

    // console.log(message);
    // console.log(notification)
    
    // await notificationModel.create(notification)
    // socket.emit('notification', notification)
    await conversation.addMessage(message.id);
  
    res.status(201).json({ messageId: message.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
/*
    if (files) {
      await uploadFile(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }

      res.status(200).send({
        message: "Uploaded the file successfully: " + req.file.originalname,
      });
    }
 */
const createConversation = async (req, res) => {
  try {
    const destinationUser = req.body.destination;
    const conversation = await conversationModel.create();

    await conversation.addUsers([req.user.id, destinationUser]);

    res.status(201).json({ conversationId: conversation.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserConversation = async (req, res) => {
  try {
    const convs = await userconversationModel.findAll({
      order: [["createdAt", "ASC"]],
      where: {
        userId: req.user.id,
      },

    });

    let convsIds = [];

    convs.forEach((element) => {
      if (convsIds.indexOf(element.dataValues.conversationId) == -1) {
        convsIds.push(element.dataValues.conversationId);
      }
    });

    const conv = await conversationModel.findAll({
      where: {
        id: convsIds,
      },
      include: [
        {
          model: messageModel,
        },
        {
          model: userModel,
          where: {
            id: {
              [Op.not]: req.user.id,
            },
          },
          attributes: ["id", "firstName","image","lastName" , "department","email","phoneNumber","position"],
        },
      ],
    });
    /**
     * {
    "id": 2,
    "firstName": "two",
    "lastName": "two",
    "email": "two@gmail.com",
    "department": "it",
    "position": "web",
    "phoneNumber": "25910678",
    "image": "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    "userproject": {
        "userId": 2,
        "projectId": 2,
        "createdAt": "2023-08-08T08:57:27.000Z",
        "updatedAt": "2023-08-08T08:57:27.000Z"
    }
}
     */
    // console.log(conv)
    res.status(200).json({ conversations: conv });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConvById = async (req, res) => {
  try {
    const conv = await conversationModel.findAll({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: messageModel,
        },
        {
          model: userModel,
          where: {
            id: {
              [Op.not]: req.user.id,
            },
          },
          attributes: ["firstName", "image"],
        },
      ],
    });
    res.status(200).json({ conversation: conv });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewed = async(req,res)=>{
  try {
    const ids = req.body.Ids
    await messageModel.update({
      viewed: true
    },
    {where: {id: ids}})
    res.status(200).json({message: 'Messages updated'})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  createConversation,
  sendMessage,
  getUserConversation,
  getConvById,
  // uploadAndReturnFileMetadata
  viewed
};
