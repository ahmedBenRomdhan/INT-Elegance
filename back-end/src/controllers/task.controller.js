const db = require("../models/index");
const taskModel = db.task;
const phaseModel = db.phase;
const userModel = db.user;
const projectModel = db.project;

// Définir l'ordre des types de tâches
const order = ["Item", "Feature", "Bug", "Task", "Remark", "Action"];

const { Op } = require("sequelize");
const inProgressStat = "In Progress";
const newStatus = "New";

/* Create New Task */
const addTask = async (req, res, next) => {
  const {
    name,
    status,
    priority,
    type,
    startDate,
    endDate,
    estimatedTime,
    realisation,
    comment,
    phaseId,
    userId,
    parentId,
  } = req.body;
  const { inProgressStatus, completedStatus } = req.query;
  try {
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "phase not found" });
    }
    const isTaskExistInProject = await taskModel.findOne({
      where: {
        name: name,
      },
      include: [
        {
          model: phaseModel,
          as: "phase",
          where: { projectId: phase.projectId },
        },
      ],
    });
    if (isTaskExistInProject) {
      return res.status(422).send({
        type: "Failed",
        message: "Le ticket existe déjà",
      });
    }

    let taskobj = {
      name,
      status,
      priority,
      type,
      startDate,
      endDate,
      estimatedTime,
      realisation,
      comment,
      phaseId,
    };
    let parentTask;
    if (parentId) {
      parentTask = await taskModel.findByPk(parentId);
      if (!parentTask) {
        return res
          .status(404)
          .send({ type: "Failed", message: "parent task not found" });
      }
      taskobj = {
        ...taskobj,
        parentId: parentId,
      };
    }
    if (userId) {
      const user = await userModel.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .send({ type: "Failed", message: "user not found" });
      }
      taskobj = {
        ...taskobj,
        userId: userId,
      };
    }
    const taskResponse = await taskModel.create(taskobj);
    if (parentId) {
      if (parentTask.status == completedStatus) {
        await parentTask
          .update({ status: inProgressStatus })
          .then(async (response) => {
            if (!response) {
              return res.status(400).send({
                type: "Failed",
                message: "Unable to Update the Status of Parent Task",
              });
            }
          });
      }
    }
    res.status(201).send({
      type: "Success",
      message: "Task Added Successfully",
      results: taskResponse,
    });
    req.taskId = taskResponse.dataValues.id;
    req.entityName = name;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Create child task */
const addChild = async (req, res) => {
  const {
    name,
    status,
    priority,
    type,
    startDate,
    endDate,
    estimatedTime,
    realisation,
    comment,
    phaseId,
    userId,
  } = req.body;

  const parentId = req.params.parentId;
  const { inProgressStatus, completedStatus } = req.query;

  try {
    const isTaskExist = await taskModel.findOne({
      where: { name: name },
    });
    if (isTaskExist) {
      return res.status(400).send({
        type: "Failed",
        message: "Task Already Exists",
      });
    }
    const parent = await taskModel.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent task not found" });
    }
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res.status(404).json({ message: "Phase not found" });
    }
    let childTaskObj = {
      name,
      status,
      priority,
      type,
      startDate,
      endDate,
      estimatedTime,
      realisation,
      comment,
      phaseId,
    };

    if (userId) {
      const user = await userModel.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .send({ type: "Failed", message: "user not found" });
      }
      childTaskObj = {
        ...childTaskObj,
        userId: userId,
      };
    }
    const child = await parent.createChild(childTaskObj);
    if (parent.status == completedStatus) {
      await parent
        .update({ status: inProgressStatus })
        .then(async (response) => {
          if (!response) {
            return res.status(400).send({
              type: "Failed",
              message: "Unable to Update the Status of Parent Task",
            });
          }
        });
    }
    // Calculate realization for parent task
    await calculateTaskRealization(parentId);

    res.status(201).json(child);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* Get Tasks By Phase */
const getTasksByPhase = async (req, res) => {
  const phaseId = req.params.id;
  const canceledStatus = req.query.canceledStatus;
  try {
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Phase not found" });
    }
    let taskList;
    if (canceledStatus) {
      taskList = await taskModel.findAll({
        where: {
          phaseId: phaseId,
          status: {
            [Op.ne]: canceledStatus,
          },
        },
        include: [
          {
            model: phaseModel,
            as: "phase",
            include: [
              {
                model: projectModel,
                as: "project",
                include: [
                  {
                    model: userModel,
                    paranoid: false,
                    as: "users",
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
                  },
                ],
              },
            ],
          },
          {
            model: userModel,
            paranoid: false,
            as: "user",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "department",
              "position",
              "image",
            ],
          },
        ],
      });
    } else {
      taskList = await taskModel.findAll({
        where: { phaseId: phaseId },
        include: [
          {
            model: phaseModel,
            as: "phase",
            include: [
              {
                model: projectModel,
                as: "project",
                include: [
                  {
                    model: userModel,
                    paranoid: false,
                    as: "users",
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
                  },
                ],
              },
            ],
          },
          {
            model: userModel,
            paranoid: false,
            as: "user",
            attributes: [
              "id",
              "firstName",
              "lastName",
              "email",
              "department",
              "position",
              "image",
            ],
          },
        ],
      });
    }
    // Trier les tâches en fonction du type
    taskList.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Children Tasks */
const getChildrenTasks = async (req, res) => {
  const parentId = req.params.id;
  try {
    const parent = await taskModel.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent task not found" });
    }
    const taskList = await taskModel.findAll({
      where: { parentId: parentId },
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
              include: [
                {
                  model: userModel,
                  paranoid: false,
                  as: "users",
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
                },
              ],
            },
          ],
        },
        {
          model: userModel,
          paranoid: false,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
      ],
    });
    // Trier les tâches en fonction du type
    taskList.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Task By Id */
const getTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await taskModel.findOne({
      where: { id: taskId },
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
              include: [
                {
                  model: userModel,
                  paranoid: false,
                  as: "users",
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
                },
              ],
            },
          ],
        },
      ],
    });
    if (!task) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Task" });
    }
    return res.status(200).send(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete Task By Id */
const deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  try {
    const task = await taskModel.findByPk(taskId, {
      include: [
        {
          model: phaseModel,
          as: "phase",
        },
      ],
    });
    if (!task) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Task" });
    }

    await taskModel.update({ parentId: null }, { where: { parentId: taskId } });
    const parentIdToUpdate = task.parentId;

    taskModel.destroy({ where: { id: taskId } }).then(async (response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Delete the Task",
        });
      }

      if (parentIdToUpdate) {
        // Calculate realization for parent task
        await calculateTaskRealization(parentIdToUpdate);
      }

      res.status(200).send({
        type: "Success",
        message: "Task Deleted Successfully !",
      });
    });
    req.projectId = task.phase.projectId;
    req.entityName = task.name;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update Task By Id */
const editTask = async (req, res) => {
  const {
    newStatus,
    inProgressStatus,
    completedStatus,
    canceledStatus,
    backlog,
    otherTasks,
  } = req.query;
  const taskId = req.params.id;
  const {
    name,
    status,
    priority,
    type,
    startDate,
    endDate,
    estimatedTime,
    realisation,
    comment,
    phaseId,
    userId,
    parentId,
    passedTime,
    url,
  } = req.body;

  try {
    const task = await taskModel.findByPk(taskId);
    if (!task) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Task not found" });
    }
    const phase = await phaseModel.findByPk(phaseId);
    if (!phase) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Phase not found" });
    }

    let taskobj = {
      name,
      status,
      priority,
      type,
      startDate,
      endDate,
      estimatedTime,
      realisation,
      comment,
      phaseId,
      userId,
      passedTime,
      url,
    };
    if (userId) {
      const user = await userModel.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .send({ type: "Failed", message: "user not found" });
      }
      taskobj = {
        ...taskobj,
        userId: userId,
      };
    }

    if (taskobj.status === canceledStatus) {
      await taskModel.update(
        { status: canceledStatus },
        { where: { parentId: taskId } }
      );
    }

    if (taskobj.status !== newStatus && taskobj.status !== canceledStatus) {
      if (!taskobj.userId)
        return res
          .status(422)
          .send({ type: "Failed", message: "Veuillez assigner le ticket !" });
    }

    if (parentId) {
      const parentTask = await taskModel.findByPk(parentId);
      if (!parentTask) {
        return res
          .status(404)
          .send({ type: "Failed", message: "parent task not found" });
      }
      taskobj = {
        ...taskobj,
        parentId: parentId,
      };

      /*Update parent task status */
      if (taskobj.status == inProgressStatus) {
        if (parentTask.status == newStatus) {
          taskModel
            .update(
              { status: inProgressStatus },
              {
                where: { id: parentId },
              }
            )
            .then(async (response) => {
              if (!response) {
                return res.status(400).send({
                  type: "Failed",
                  message: "Unable to Update the Status of Parent Task",
                });
              }
            });
        }
        const backlogResponse = await phaseModel.findOne({
          where: { title: backlog, projectId: phase.projectId },
        });
        if (parentTask.phaseId == backlogResponse.id) {
          const otherTasksResponse = await phaseModel.findOne({
            where: { title: otherTasks, projectId: phase.projectId },
          });

          taskModel
            .update(
              { phaseId: otherTasksResponse.id },
              {
                where: { id: parentId },
              }
            )
            .then(async (response) => {
              if (!response) {
                return res.status(400).send({
                  type: "Failed",
                  message: "Unable to Update the Phase of Parent Task",
                });
              }
            });
        }
      }
    }
    if (taskobj.status == inProgressStatus) {
      /*Update phase status */
      /*  if (phase.status == newStatus) {
         phaseModel
           .update(
             { status: inProgressStatus },
             {
               where: { id: phase.id },
             }
           )
           .then(async (response) => {
             if (!response) {
               return res.status(400).send({
                 type: "Failed",
                 message: "Unable to Update the Status of Phase",
               });
             }
           });
       }*/
      /*Update project status */
      const project = await projectModel.findByPk(phase.projectId);
      if (!project) {
        return res
          .status(404)
          .send({ type: "Failed", message: "Project not found" });
      }
      if (project.status == newStatus) {
        projectModel
          .update(
            { status: inProgressStatus },
            {
              where: { id: phase.projectId },
            }
          )
          .then(async (response) => {
            if (!response) {
              return res.status(400).send({
                type: "Failed",
                message: "Unable to Update the Status of Project",
              });
            }
          });
      }
    }

    /*Update task status */
    /*  if (taskobj.realisation == 100) {
      taskobj = {
        ...taskobj,
        status: completedStatus,
      };
    }*/
    /*Update task realisation */
    if (taskobj.status == completedStatus) {
      taskobj = {
        ...taskobj,
        realisation: 100,
      };
    }

    taskModel
      .update(taskobj, {
        where: { id: taskId },
      })
      .then(async (response) => {
        if (!response) {
          res.status(400).send({
            type: "Failed",
            message: "Unable to Update the Task",
          });
        }

        // Calculate realization for parent task
        if (parentId) {
          await calculateTaskRealization(parentId);
        }
        res.status(200).send({
          type: "Success",
          message: "Task Updated Successfully !",
          results: taskobj,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Search Tasks */
const getTasksByAttribute = async (req, res) => {
  try {
    const { type, status, priority, startDate, endDate, phaseId } = req.query;

    const whereClause = {};
    whereClause.phaseId = phaseId;
    if (type && type !== "All") {
      whereClause.type = type;
    }

    if (status && status !== "All") {
      whereClause.status = status;
    }

    if (priority && priority !== "All") {
      whereClause.priority = priority;
    }

    if (startDate !== "null" && endDate !== "null") {
      whereClause.startDate = { [Op.gte]: startDate };
      whereClause.endDate = { [Op.lte]: endDate };
    } else if (startDate !== "null") {
      whereClause.startDate = { [Op.gte]: startDate };
    } else if (endDate !== "null") {
      whereClause.endDate = { [Op.lte]: endDate };
    }
    const tasks = await taskModel.findAll({
      where: whereClause,
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
              include: [
                {
                  model: userModel,
                  paranoid: false,
                  as: "users",
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
                },
              ],
            },
          ],
        },
        {
          model: userModel,
          paranoid: false,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    // Trier les tâches en fonction du type
    tasks.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasksByProjectByUser = async (req, res) => {
  try {
    const { projectId, userId } = req.query;

    const whereClause = {};
    whereClause.userId = userId;

    const tasks = await taskModel.findAll({
      where: whereClause,
      include: [
        {
          model: userModel,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
              where: {},
            },
          ],
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (projectId !== "All") {
      // Filter tasks by project
      const filteredTasks = tasks.filter((task) => {
        const phase =
          task.phase && Array.isArray(task.phase) ? task.phase[0] : task.phase;
        const project =
          phase && phase.project && Array.isArray(phase.project)
            ? phase.project[0]
            : phase.project;

        return project.id == projectId;
      });

      // Trier les tâches en fonction du type
      filteredTasks.sort((a, b) => {
        const typeA = a.type;
        const typeB = b.type;
        return order.indexOf(typeA) - order.indexOf(typeB);
      });

      res.status(200).json(filteredTasks);
    } else {
      // Trier les tâches en fonction du type
      tasks.sort((a, b) => {
        const typeA = a.type;
        const typeB = b.type;
        return order.indexOf(typeA) - order.indexOf(typeB);
      });

      res.status(200).json(tasks);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Calculate Parent Task Realisation */
const calculateTaskRealization = async (taskId) => {
  const childrenTasks = await taskModel.findAll({
    where: { parentId: taskId },
    attributes: ["realisation"],
  });

  const numChildrenTasks = childrenTasks.length;
  let totalRealization = 0;

  childrenTasks.forEach((task) => {
    totalRealization += task.realisation;
  });

  const parentTask = await taskModel.findByPk(taskId);
  if (numChildrenTasks > 0) {
    const parentRealization = (totalRealization / numChildrenTasks).toFixed(2); // format the value with two decimal places.
    await parentTask
      .update({ realisation: parentRealization })
      .then(async (response) => {
        if (!response) {
          return res.status(400).send({
            type: "Failed",
            message: "Unable to Update Parent Task Realisation",
          });
        }
      });
  }

  // Recursively calculate realization for parent tasks
  if (parentTask.parentId) {
    await calculateTaskRealization(parentTask.parentId);
  }
};

/* Get Tasks By User */
const getTasksByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .send({ type: "Failed", message: "User not found" });
    }
    const taskList = await taskModel.findAll({
      where: { userId: userId },
      include: [
        {
          model: phaseModel,
          as: "phase",
          include: [
            {
              model: projectModel,
              as: "project",
            },
          ],
        },
        {
          model: userModel,
          paranoid: false,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "department",
            "position",
            "image",
          ],
        },
      ],
    });
    // Trier les tâches en fonction du type
    taskList.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      return order.indexOf(typeA) - order.indexOf(typeB);
    });
    res.status(200).send(taskList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Statistics Tasks By User */
const getStatisticsTasksByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .send({ type: "Failed", message: "User not found" });
    }
    let countInProgressTasks = await taskModel.count({
      where: { userId: userId, status: inProgressStat },
    });
    let countNewTasks = await taskModel.count({
      where: { userId: userId, status: newStatus },
    });
    const result = {
      inProgressTasks: countInProgressTasks,
      newTasks: countNewTasks,
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addTask,
  getTask,
  deleteTask,
  editTask,
  addChild,
  getTasksByPhase,
  getTasksByAttribute,
  getChildrenTasks,
  getTasksByUser,
  getStatisticsTasksByUser,
  getTasksByProjectByUser,
};
