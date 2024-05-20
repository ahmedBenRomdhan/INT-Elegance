const db = require("../models");
const roleModel = db.role;
const permissionModel = db.permission;
const userModel = db.user;

/* GET All Roles */
const getAllRoles = async (req, res) => {
  let roleListResponse = await roleModel.findAll({
    order: [["name", "ASC"]],
    include: [
      {
        model: permissionModel,
        attributes: ["id", "name", "path"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  res.status(200).send(roleListResponse);
};

/** GET Dashboard Permission */
const getDashboardPermission = async (permission) => {
  const response = await permissionModel.findOne({
    where: { path: permission },
  });
  return response;
};

/* Create New Role */
const addRole = async (req, res) => {
  const { name, description, permissions } = req.body;
  const dashboardPermission = req.query.dashboardPermission;

  const isRoleExist = await roleModel.findOne({
    where: { name: name },
  });
  if (isRoleExist) {
    return res.status(422).send({
      type: "Failed",
      message: "Le role existe déjà",
    });
  }

  const roleObj = {
    name: name,
    description: description,
  };
  
  const role = await roleModel.create(roleObj);
  const dashboardPerm = await getDashboardPermission(dashboardPermission);
  await role.addPermission(dashboardPerm.id);

  if (permissions && permissions.length > 0) {
    await role.addPermission(permissions);
  }
  return res.status(201).send({
    type: "Success",
    message: "Role Added Successfully",
    results: role,
  });
};


/* Update Existing Role */
const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const dashboardPermission = req.query.dashboardPermission;

  const { name, description, permissions } = req.body;
  try {
    const role = await roleModel.findByPk(roleId, {
      include: [
        {
          model: permissionModel,
          attributes: ["id", "name", "path"],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: ["id", "name", "description"],
    });
    if (!role) {
      return res.status(404).send({
        type: "Failed",
        message: "Unable to Find the Role",
      });
    }

    // Update the role properties
    role.name = name;
    role.description = description;

    const dashboardPerm = await getDashboardPermission(dashboardPermission);

    if (permissions) {
      // Compare the existing and new permissions
      const existingPermissions = role.permissions.map((p) => p.id);
      const newPermissions = permissions.map((p) => p);
      newPermissions.push(dashboardPerm.id)
      // Delete permissions that are not in the new permissions list
      const permissionsToDelete = existingPermissions.filter(
        (p) => !newPermissions.includes(p)
      );
      await role.removePermissions(permissionsToDelete);

      // Add new permissions that are not already associated with the role
      const permissionsToAdd = permissions.filter(
        (p) => !existingPermissions.includes(p.id)
      );
      await role.addPermissions(permissionsToAdd);
    }
    // Save the updated role
    await role.save();

    return res.status(200).send({
      type: "Success",
      message: "Role Updated Successfully !",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Delete Existing Role */
const deleteRole = async (req, res) => {
  const roleId = req.params.id;
  try {
    const role = await roleModel.findByPk(roleId, {
      include: [
        {
          model: permissionModel,
          attributes: ["id", "name", "path"],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: ["id", "name", "description"],
    });
    const permissionsToDelete = role.permissions.map((p) => p.id);
    await role.removePermissions(permissionsToDelete);
    await userModel.update(
      { roleId: null },
      { where: { roleId: roleId }, paranoid: false }
    );
    roleModel.destroy({ where: { id: roleId } }).then((response) => {
      if (!response) {
        res.status(400).send({
          type: "Failed",
          message: "Unable to Delete the Role",
        });
      }
      res.status(200).send({
        type: "Success",
        message: "Role Deleted Successfully !",
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET Role By Id */
const getRole = async (req, res) => {
  const roleId = req.params.id;
  const roleResponse = await roleModel.findOne({
    where: { id: roleId },
    include: [
      {
        model: permissionModel,
        attributes: ["id", "name", "path"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (!roleResponse)
    res
      .status(404)
      .send({ type: "Failed", message: "Unable to Find the Role" });
  else res.status(200).send(roleResponse);
};

module.exports = {
  getAllRoles,
  addRole,
  updateRole,
  deleteRole,
  getRole,
};
