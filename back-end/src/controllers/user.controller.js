const db = require("../models");

const userModel = db.user;
const roleModel = db.role;
const userProjectModel = db.userproject;
const projectModel = db.project;

var bcrypt = require("bcrypt");
var {createPassword} = require("../helpers/createPassword");
const emailNotifications = require("../helpers/emailNotifications");
var csv = require("csvtojson");

const { validationResult } = require("express-validator");
const { Op, Sequelize } = require("sequelize");

var xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");


/* Create New User */
const addUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      department,
      position,
      roleId,
    } = req.body;
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    const isUserExist = await userModel.findOne({
      where: { email: email },
      paranoid: false,
    });
    if (isUserExist) {
      return res.status(422).send({
        type: "Failed",
        message: "Un utilisateur existe déjà avec cette adresse e-mail",
      });
    }
    const role = await roleModel.findByPk(roleId);

    if (!role) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Role not found" });
    }

    
    const genertedPassword = createPassword(8, true, true);
    const hash = await bcrypt.hash(genertedPassword, 10);

    let userObj = {
      firstName,
      lastName,
      email,
      password: hash,
      phoneNumber,
      department,
      position,
      roleId,
    };

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      userObj = {
        ...userObj,
        image: url + "/images/" + req.file.filename,
      };
    }
    const user = await userModel.create(userObj);
    emailNotifications.sendUserAuth(
      userObj.firstName,
      userObj.lastName,
      userObj.email,
      genertedPassword
    );
    res.status(201).send({
      type: "Success",
      message: "User Added Successfully",
      results: user,
    });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET All Users */
const getAllUsers = async (req, res) => {
  const userListResponse = await userModel.findAll({
    paranoid: false,
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    order: [["firstName", "ASC"]],
    include: [
      {
        model: roleModel,
        as: "role",
        include: [
          {
            model: db.permission,
            as: "permissions",
            attributes: ["id", "name", "path"],
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });
  res.status(200).send(userListResponse);
};

/* GET Active Users */
const getActiveUsers = async (req, res) => {
  const userListResponse = await userModel.findAll({
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    order: [["firstName", "ASC"]],
  });
  res.status(200).send(userListResponse);
};

const importFile = async (req, res) => {
  try {
    const filename = req.file.filename;
    const filePath = path.join(__dirname, "../../public/uploads", filename);

    // Read the file buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileType = req.file.mimetype;

    let usersNotAddedCount = 0;
    let jsonData = [];
    if (fileType === "text/csv") {
      jsonData = await csv().fromString(fileBuffer.toString());
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel"
    ) {
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = xlsx.utils.sheet_to_json(worksheet);
    } else {
      throw new Error("Invalid file type");
    }
    await Promise.all(
      jsonData.map(async (row) => {
        if (
          !row.firstName ||
          !row.lastName ||
          !row.email ||
          !row.department ||
          !row.position ||
          !row.role
        ) {
          usersNotAddedCount++;
        } else {
          const roleResponse = row.role;
          const isRoleExist = await roleModel.findOne({
            where: { name: roleResponse },
          });
          if (isRoleExist) {
            row.role = isRoleExist.id;
            const emailResponse = row.email;
            const isUserExist = await userModel.findOne({
              where: { email: emailResponse },
            });
            if (!isUserExist) {
              const generatedPassword = createPassword(8, true, true);
              const hash = await bcrypt.hash(generatedPassword, 10);
              let userData = {
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                password: hash,
                phoneNumber: row.phoneNumber || null,
                department: row.department,
                position: row.position,
                roleId: row.role,
              };
              await userModel.create(userData);
              emailNotifications.sendUserAuth(
                userData.email,
                generatedPassword
              );
            } else {
              usersNotAddedCount++;
            }
          } else {
            usersNotAddedCount++;
          }
        }
      })
    );

    const result = `${jsonData.length - usersNotAddedCount}/${jsonData.length}`;
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Update Existing User */
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    position,
    roleId,
  } = req.body;

  let userObj = {
    firstName,
    lastName,
    email,
    phoneNumber,
    department,
    position,
    roleId,
  };

  const role = await roleModel.findByPk(roleId);
  if (!role) {
    return res.status(404).send({ type: "Failed", message: "Role not found" });
  }

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    userObj = {
      ...userObj,
      image: url + "/images/" + req.file.filename,
    };
  }

  userModel
    .update(userObj, {
      where: { id: userId },
    })
    .then((response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Update the User",
        });
      }
      res.status(200).send(userObj);
    });
};

/* Delete Existing User */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findByPk(userId);
    if (!user)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the User" });

    user.destroy().then((response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Delete the User",
        });
      }
      res.status(200).send({
        type: "Success",
        message: "User Deleted Successfully !",
      });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET User By Id */
const getUser = async (req, res) => {
  const userId = req.params.id;
  const userResponse = await userModel.findOne({
    where: { id: userId },
    paranoid: false,
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    include: [
      {
        model: roleModel,
        as: "role",
      },
    ],
  });
  if (!userResponse)
    res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the User" });
  return res.status(200).send(userResponse);
};

/* GET User Profile */
const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  const userResponse = await userModel.findOne({
    where: { id: userId },
    paranoid: false,
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    include: [
      {
        model: roleModel,
        as: "role",
        include: [
          {
            model: db.permission,
            as: "permissions",
            attributes: ["id", "name", "path"],
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });
  if (!userResponse)
    res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the User" });
  return res.status(200).send(userResponse);
};

const updatePassword = async (req, res) => {
  const id = req.params.id;
  const { password, oldPassword } = req.body;
  const user = await userModel.findByPk(id);

  if (!user)
    return res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the User" });

  if (bcrypt.compareSync(oldPassword, user.password)) {
    const hash = await bcrypt.hash(password, 10);
    userModel
      .update(
        { password: hash },
        {
          where: { id: id },
        }
      )
      .then((response) => {
        if (!response) {
          res.status(400).send({
            type: "Failed",
            message: "Unable to Update the User's password",
          });
        }
        emailNotifications.sendUserNewPassword(
          user.firstName,
          user.lastName,
          user.email,
          password
        );

        res.status(200).send({
          type: "Success",
          message: "User's password Updated Successfully !",
        });
      });
  } else
    res.status(422).send({
      type: "Failed",
      message: "L'ancien mot de passe est incorrecte",
    });
};

const searchUsers = async (req, res) => {
  const searchKey = req.query.search;
  try {
    const users = await userModel.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchKey}%` } },
          { lastName: { [Op.iLike]: `%${searchKey}%` } },
          { email: { [Op.iLike]: `%${searchKey}%` } },
          { phoneNumber: { [Op.iLike]: `%${searchKey}%` } },
          { department: { [Op.iLike]: `%${searchKey}%` } },
          { position: { [Op.iLike]: `%${searchKey}%` } },
          { "$role.name$": { [Op.iLike]: `%${searchKey}%` } },
        ],
      },
      include: "role",
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const calculateProjectCountByUser = async (req, res) => {
  try {
    const { status } = req.query;

    const projectCounts = await userProjectModel.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("COUNT", Sequelize.col("projectId")), "projectCount"],
        [
          Sequelize.literal(`SUM(project.status ='${status}')`),
          "inProgressCount",
        ],
      ],
      include: [
        {
          model: userModel,
          as: "user",
          attributes: [],
        },
        {
          model: projectModel,
          as: "project",
          attributes: [],
        },
      ],
      group: ["userId"],
      raw: true,
    });

    if (!projectCounts) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find Data" });
    }

    const populatedProjects = await Promise.all(
      projectCounts.map(async (project) => {
        const user = await userModel.findOne({
          where: { id: project.userId },
          paranoid: false,
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
        });

        return {
          ...project,
          user,
        };
      })
    );

    return res.status(200).send(populatedProjects);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const calculateUserCountByDepartment = async (req, res) => {
  try {
    const userCounts = await userModel.findAll({
      attributes: [
        "department",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "userCount"],
      ],
      group: ["department"],
      raw: true,
    });
    if (!userCounts) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Data" });
    }
    const result = userCounts.map((elt) => ({
      name: elt.department,
      value: elt.userCount,
    }));
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

/* GET Count Users */
const calculateUsersCount = async (req, res) => {
  try {
    let countUsers = await userModel.count({});

    if (!countUsers) {
      res.status(404).send({ type: "Failed", message: "Unable to Find Users" });
    }

    const result = {
      countUsers: countUsers,
    };

    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Restore Deleted User */
const restoreUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findByPk(userId, { paranoid: false });
    if (!user)
      return res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the User" });

    user.restore().then((response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Restore the User",
        });
      }
      res.status(200).send({
        type: "Success",
        message: "User Restored Successfully !",
      });
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Only Available Users */
const getAvailableUsers = async (req, res) => {
  const projectId = req.params.id;
  try {
    const allUsers = await userModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });

    const userProjectIds = await userProjectModel.findAll({
      where: { projectId: projectId },
      attributes: ["userId"],
    });
    const userIdsInUserProject = userProjectIds.map((item) => item.userId);

    // Filtrer la liste des utilisateurs pour éliminer ceux dont l'ID figure dans "userProjectIds"
    const availableUsers = allUsers.filter(
      (user) => !userIdsInUserProject.includes(user.id)
    );

    res.status(200).send(availableUsers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRoleInfo = async (roleName) => {
  const response = await roleModel.findOne({
    where: { name: roleName },
  });
  return response;
};

/* Count Users By Role */
const countUsersByRole = async (req, res) => {
  const role = req.query.role;
  try {
    const roleInfo = await getRoleInfo(role);
    let countResponse = await userModel.count({
      where: { roleId: roleInfo.id },
      paranoid: false,
    });
    res.status(200).send(countResponse.toString());
  } catch (error) {
    res.status(500).send(error);
  }
};

const searchUsersChat = async (req, res) => {
  
  try {
    const terms = req.query.term;

    if (terms) {
      const users = await userModel.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.regexp]: terms } },
            { lastName: { [Op.regexp]: terms } },
          ],
        },
        attributes:["id","firstName","lastName","image"]
      });

      res.status(200).json({ users });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

// try {
//   const terms = req.query.term;

//   if (terms) {
//     const authenticatedUserId = req.user.id;

//     const conversationUserIds = await userconversationModel
//       .findAll({
//         where: {
//           userId: authenticatedUserId,
//         },
//         attributes: ["conversationId"],
//         raw: true,
//       })
//       .then((result) => result.map((row) => row.conversationId));

//     const users = await userModel.findAll({
//       where: {
//         [Op.and]: [
//           { id: { [Op.ne]: authenticatedUserId } },
//           {
//             [Op.or]: [
//               { firstName: { [Op.regexp]: terms } },
//               { lastName: { [Op.regexp]: terms } },
//             ],
//           },
//         ],
//       },
//       include: [
//         {
//           model: conversationModel,
//           attributes: ["id"],
//           through: {
//             attributes: [],
//           },
//         },
//       ],
//     });

//     const filteredUsers = users.filter((user) => {
//       const userConversationIds = user.conversations.map((conversation) => conversation.id);
//       const commonConversationIds = conversationUserIds.filter((id) => userConversationIds.includes(id));
//       return commonConversationIds.length > 0 || userConversationIds.length === 0;
//     });
//     res.status(200).json({ users: filteredUsers });
//   }
// } catch (error) {
//   res.status(500).json({ error: error.message });
// }
};
const getUserByConversation = async (req, res) => {
try {
  let users = [];
  users = await userModel.findAll({
    where: {
      id: { [Op.ne]: req.user.id },
    },
    include: [
      {
        model: conversationModel,
        through: {
          model: userconversationModel,
          attributes: [],
        },
      },
    ],
  });
  res.status(200).json({ users: users });
} catch (error) {
  res.status(500).json({ error: error.message });
}
};

module.exports = {
  getAllUsers,
  addUser,
  importFile,
  updateUser,
  deleteUser,
  getUser,
  getUserProfile,
  updatePassword,
  searchUsers,
  calculateProjectCountByUser,
  calculateUserCountByDepartment,
  calculateUsersCount,
  restoreUser,
  getAvailableUsers,
  getActiveUsers,
  countUsersByRole,
  searchUsersChat,
  getUserByConversation
};
