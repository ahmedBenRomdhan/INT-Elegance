const db = require("../models");
const userModel = db.user;
const roleModel = db.role;
const bcrypt = require("bcrypt");
const tokenService = require("../services/token.service");

module.exports = {
  signin: async (req, res) => {
    try {
      const user = await userModel.findOne({
        where: { email: req.body.email },
        paranoid: false,
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
      if (!user)
        res
          .status(404)
          .send({ type: "Failed", message: "Email ou Mot de passe incorrecte ! Veuillez vérifier." });
      else {
        if (user.deletedAt != null)
          return res
            .status(405)
            .send({
              message:
                "Votre compte est désactivé ! Veuillez contacter l'administarteur.",
            });
        if (user.roleId == null)
          return res
            .status(405)
            .send({
              message:
                "Votre rôle est supprimé ! Veuillez contacter l'administarteur.",
            });

        if (bcrypt.compareSync(req.body.password, user.password)) {
          let accessToken = await tokenService.getAccessToken(user);
          let refreshToken = await tokenService.getRefreshToken(user);
          return res
            .status(200)
            .send({ accessToken, refreshToken, user, expiresIn: 9999999 });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.status(400).send({message:"Email ou Mot de passe incorrecte ! Veuillez vérifier."});
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  forgot: async (req, res) => {},
};
