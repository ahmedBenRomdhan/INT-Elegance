const db = require("../models");

/* GET All Trails Project */
const getAllTrailsProject = async (req, res) => {
  const projectId = req.params.id;
  try {
    const listProjectTrails = await db.trailProject.findAll({
      where: { entityId: projectId },
      include: [
        {
          model: db.user,
          as: "user",
          paranoid: false,
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
      order: [["createdAt", "DESC"]],
    });
    const listProjectPhasesTrails = await db.trailPhase.findAll({
      where: { entityId: projectId },
      include: [
        {
          model: db.user,
          as: "user",
          paranoid: false,
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
      order: [["createdAt", "DESC"]],
    });

    const listProjectTasksTrails = await db.trailTask.findAll({
      where: {
        entityId: projectId,
        eventType: "DELETE",      
      },
      include: [
        {
          model: db.user,
          as: "user",
          paranoid: false,
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
      order: [["createdAt", "DESC"]],
    });
    const trailList = [...listProjectTrails, ...listProjectPhasesTrails, ...listProjectTasksTrails];
    trailList.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).send(trailList);
  } catch (error) {
    res.status(404).send({
      type: "Failed",
      message: "Unable to Find Trails",
      error: error,
    });
  }
};

/* GET All Trails Task */
const getAllTrailsTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const listTrails = await db.trailTask.findAll({
      where: { entityId: taskId },
      include: [
        {
          model: db.user,
          as: "user",
          paranoid: false,
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
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(listTrails);
  } catch (error) {
    res.status(404).send({
      type: "Failed",
      message: "Unable to Find Trails",
      error: error,
    });
  }
};
/* GET All Trails Users */
const getAllTrailsUsers = async (req, res) => {
  try {
    const listTrails = await db.trailUser.findAll({
      include: [
        {
          model: db.user,
          as: "user",
          paranoid: false,
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
      order: [["createdAt", "DESC"]],
    });
   
    res.status(200).send(listTrails);
  } catch (error) {
    res.status(404).send({
      type: "Failed",
      message: "Unable to Find Trails",
      error: error,
    });
  }
};
module.exports = { getAllTrailsProject, getAllTrailsTask, getAllTrailsUsers };
