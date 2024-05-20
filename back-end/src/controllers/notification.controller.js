const db = require("../models");
const notificationModel = db.notification
const { Op } = require("sequelize");


const addNotif = async ( req, res) => {
    try {
        const {subject, from, to, useravatar, treated} = req.body
        const notification = {
            from,
            subject,
            useravatar,
            treated,
            to
          }
        await notificationModel.create(notification)
        
        console.log(notification)

        res.status(200).json({message: "notification sent"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }    
}


const getNotif = async (req, res) => {

   const id = req.user.id;
   try{
      const notifications = await notificationModel.findAll({
        where:{
            to: id
        }
      })
      

      res.status(200).json({message: notifications});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
const editNotif = async(req, res) => {
 
  try {
    // Find the record with the specified id
    const notificationToUpdate = await notificationModel.findOne({ where: { id: req.params.id } });

    if (!notificationToUpdate) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update all records with the same 'from' and 'to' fields
    const update = {
      treated: true
    };
    
    await notificationModel.update(update, {
      where: {
        from: notificationToUpdate.from,
        to: notificationToUpdate.to
      }
    });

    res.status(200).json({ message: 'Notifications updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports= {
    getNotif,
    addNotif,
    editNotif
}