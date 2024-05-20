const db = require("../models/index");
const projectModel = db.project;
const phaseModel = db.phase;
const taskModel = db.task;
const userModel = db.user;

/* Create New Phase */
const addPhase = async (req, res, next) => {
  const { title, description, startDate, endDate, status, projectId } =
    req.body;
  try {
    const project = await projectModel.findByPk(projectId);
    if (!project) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Project not found" });
    }
    const isPhaseExist = await phaseModel.findOne({
      where: { projectId: projectId, title: title },
    });
    if (isPhaseExist) {
      return res.status(422).send({
        type: "Failed",
        message: "La phase existe déjà",
      });
    }
    const phaseObj = {
      title,
      description,
      startDate,
      endDate,
      status,
      projectId,
    };
    const phase = await phaseModel.create(phaseObj);

    res.status(201).send({
      type: "Success",
      message: "Phase Added Successfully",
      results: phase,
    });

    req.projectId = projectId;
    req.entityName = title;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Phases By Project */
const getPhasesByProject = async (req, res) => {
  const projectId = req.params.id;
  try {
    const project = await projectModel.findByPk(projectId);
    if (!project) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Project not found" });
    }
    const phaseList = await phaseModel.findAll({
      where: { projectId: projectId },
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
                "phoneNumber",
                "image",
              ],
            },
          ],
        },
        {
          model: taskModel,
          as: "tasks",
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).send(phaseList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Phase By Id */
const getPhase = async (req, res) => {
  const phaseId = req.params.id;

  try {
    const phaseResponse = await phaseModel.findOne({
      where: { id: phaseId },
      include: [
        {
          model: projectModel,
          as: "project",
          include: [
            {
              model: userModel,
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
        {
          model: taskModel,
          as: "tasks",
        },
      ],
    });
    
    if (!phaseResponse)
    return  res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Phase" });
    res.status(200).send(phaseResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Update Phase Bi Id */
const updatePhase = async (req, res, next) => {
  const phaseId = req.params.id;
  const { title, description, startDate, endDate, status, projectId } =
    req.body;
  let phaseObj = {
    title,
    description,
    startDate,
    endDate,
    status,
    projectId,
  };

  try {
    const project = await projectModel.findByPk(projectId);
    if (!project) {
      return res
        .status(404)
        .send({ type: "Failed", message: "Project not found" });
    }
    phaseModel
      .update(phaseObj, {
        where: { id: phaseId },
      })
      .then((response) => {
        if (!response) {
          res.status(400).send({
            type: "Failed",
            message: "Unable to Update the Phase",
          });
        }
        res.status(200).send({
          type: "Success",
          message: "Phase Updated Successfully !",
          results: phaseObj,
        });
      });
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete Phase */
const deletePhase = async (req, res, next) => {
  const phaseId = req.params.id;
  const { backlog, otherTasks, newStatus } = req.query;

  try {
    const phase = await phaseModel.findOne({
      where: { id: phaseId },
    });

    if (!phase)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Phase" });

    const backlogObj = await phaseModel.findOne({
      where: { title: backlog, projectId: phase.dataValues.projectId },
    });

    if (!backlogObj)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Backlog" });

    const otherTasksObj = await phaseModel.findOne({
      where: { title: otherTasks, projectId: phase.dataValues.projectId },
    });

    if (!otherTasksObj)
      res
        .status(404)
        .send({ type: "Failed", message: "Unable to Find the Other Tasks" });

    await taskModel.update(
      { phaseId: backlogObj.dataValues.id },
      { where: { phaseId: phaseId, status: newStatus } }
    );

    await taskModel.update(
      { phaseId: otherTasksObj.dataValues.id },
      { where: { phaseId: phaseId } }
    );
    await phaseModel.destroy({ where: { id: phaseId } });

    res.status(200).json({ message: "Phase deleted successfully" });
    req.projectId = phase.projectId;
    req.entityName = phase.title;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPhase,
  getPhasesByProject,
  getPhase,
  updatePhase,
  deletePhase,
};
