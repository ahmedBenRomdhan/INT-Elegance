const db = require("../models");
const roleModel = db.role;

const verifyPermission = async (req, res, next) => {
  try {
      const role = await roleModel.findByPk(req.user.roleId,{
        include: [
          {
            model: db.permission,
            attributes: ["id", "name", "path"],
            through: {
              attributes: [],
            },
          },
        ],
      })
      const permissions = role.permissions.map((permission) => permission.path);
      if (permissions.includes(req.baseUrl + req.route.path)) {
        return next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = verifyPermission;
