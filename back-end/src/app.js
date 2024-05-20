var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const sequelize = require('./config/sequelize')
const dotenv = require("dotenv");

const emailNotifications = require("./helpers/emailNotifications"); 
const permissionsSeeder = require('./seeders/20231004162303-permissions');
const roleSeeder = require('./seeders/20231004162307-role')
dotenv.config();
const cron = require('node-cron');
const db = require("../src/models/index");
const notificationModel = db.notification
const permissionModel = db.permission
const roleModel = db.role
const userModel = db.user
const projectModel = db.project;
const phaseModel = db.phase;
const { Op } = require("sequelize");
const consts = require('./config/const')
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var permissionsRouter = require('./routes/permissions');
var authRouter = require('./routes/auth');
var projectRouter= require('./routes/project')
var phaseRouter= require('./routes/phase')
var taskRouter= require('./routes/task')
var trailRouter= require('./routes/trail')
var meetingRouter= require('./routes/meeting')
var roomRouter= require('./routes/room')
var fileRouter = require('./routes/files')
var messageRouter = require('./routes/message')
var notificationRouter = require('./routes/notification')
var app = express();
console.log(process.env.NODE_ENV)
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:4200"] },
});
global.__basedir = path.join(__dirname, ".."); 
const conversations = new Map();
const users = []; // Store connected users here

function getUsersList() {
  const connectedUsers = Array.from(io.of("/").sockets)
    .filter(([id, socket]) => socket.user && socket.user.id)
    .map(([id, socket]) => ({
      id: socket.user.id,
      socketIds: [id],
    }));

  return connectedUsers
  
}
// const JWT_SECRET= 'accessSecret'
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
 
  
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = user.user;
    const usersList = getUsersList();
    // socket.broadcast.emit("user-connected", socket.user.id);
    socket.emit("users", users);
    socket.broadcast.emit("user-connected", socket.user.id)
    next();
  } catch (e) {
    console.log("Authentication error:", e.message);
    return next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  console.log("a user connected");
  
  const userIndex = users.findIndex((connectedUser) => connectedUser.id === socket.user.id);
  if (userIndex === -1) {
    users.push({ userid: socket.user.id, socketIds: [socket.id] });
  } else {
    users[userIndex].socketIds.push(socket.id);
  }
  // const userIndex = users.findIndex((connectedUser) => connectedUser.id === socket.user.id);
  // if (userIndex === -1) {
  //   users.push({ userid: socket.user.id, socketIds: [socket.id] });
  // } else {
  //   users[userIndex].socketIds.push(socket.id);
  // }
  // console.log(users)
  

  console.log(users)
  
  
  socket.on('notif', (data)=>{
    console.log('xxx',data)
  })

  socket.on('join-conversation', ({ conversationId, socketId }) => {
  if (conversations.has(conversationId)) {
    const socketIds = conversations.get(conversationId);
    if (!socketIds.includes(socketId)) {
      socketIds.push(socketId);
    }
  } else {
    conversations.set(conversationId, [socketId]);
  }

  console.log(conversations);
});

  socket.on('new-message', async({ conversationId, message, destinationId }) => {
    console.log(message)
    const notification = {
      from:`${socket.user.firstName} ${socket.user.lastName}`,
      subject:`${socket.user.firstName} has sent you a message`,
      useravatar:`${socket.user.image}`,
      treated: false,
      to:destinationId
    }
    const currentDateTime= new Date()
    await notificationModel.create(notification).then((lastCreatedNotification) => {
      const id = lastCreatedNotification.id
      socket.broadcast.emit('notif', {notification, currentDateTime,id})
    })

    
  if (conversations.has(conversationId)) {
    const socketIds = conversations.get(conversationId);
    socketIds.forEach((socketId) => {
      io.to(socketId).emit('send-message', message);
      
    });
  }
});
socket.on('user-typing', ({ conversationId, isTyping, userId}) => {
  console.log(conversationId)
  console.log(isTyping)
  console.log(userId)
  console.log(socket.user.id)
 // socket.to(conversationId).emit('typing-status', { conversationId, isTyping });
  if (conversations.has(conversationId)) {
    const socketIds = conversations.get(conversationId);
    socketIds.forEach((socketId) => {
      io.to(socketId).emit('typing-status', { conversationId, isTyping , userId});
    });
  }
});

io.on('notification', (data)=>{
  console.log(data)

})

socket.on("disconnect", () => {
  console.log("user disconnected");
  const userId = socket.user.id;

  const userIndex = users.findIndex((connectedUser) => connectedUser.userid === userId);
  if (userIndex !== -1) {
    const socketIds = users[userIndex].socketIds;
    const index = socketIds.indexOf(socket.id);
    if (index !== -1) {
      socketIds.splice(index, 1);
      if (socketIds.length === 0) {
    
        users.splice(userIndex, 1);
      }
    }
  }
  console.log(users);
  io.emit("users", users);

  io.emit("user-disconnected", socket.user.id);
});
});


app.use(
  cors({
    origin: '*', // Replace with specific origins if needed
    credentials: true,
    allowedHeaders: '*', // Allow any headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Specify the allowed HTTP methods
  })
);

// Security configuration
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers","Content-Type"
//   );

//   next();
// });
//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

async function isPermissionsTableEmpty() {
  try {
    const count = await permissionModel.count();
    return count === 0;
  } catch (error) {
    console.error('Error checking permissions table:', error);
    return true; // Assume an error means the table is empty
  }
}

async function isRoleAdminExists() {
  try {
    // Replace 'User' with your actual user model name
    const adminRole = await roleModel.findOne({ where: { name: 'admin' } });
    if(adminRole){
      return true
    }else{
      return false
    }
  } catch (error) {
    console.error('Error checking if admin user exists:', error);
    return true; // Assume an error means the user exists
  }
}
async function isPermissionsTableEmpty() {
  try {
    const count = await permissionModel.count();
    return count === 0;
  } catch (error) {
    console.error('Error checking permissions table:', error);
    return true; // Assume an error means the table is empty
  }
}

// Check if the permissions table is empty and execute the seeder if needed
async function checkAndRunSeeder(queryInterface, Sequelize) {
  const isEmpty = await isPermissionsTableEmpty();
  if (isEmpty) {
    console.log('Permissions table is empty. Running seeder...');
    try {
      await permissionsSeeder.up(queryInterface, Sequelize); // Execute the seeder
      console.log('Seeder executed successfully.');
    } catch (error) {
      console.error('Error executing permissions seeder:', error);
    }
  } else {
    console.log('Permissions table is not empty. Skipping permissions seeder.');
  }
}
const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*_-+=";

const generatePassword = (length, chars) => {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}; 

const createPassword = (length = 8, hasNumbers = true, hasSymbols = true) => {
  let chars = alpha;
  hasNumbers ? (chars += numbers) : "";
  hasSymbols ? (chars += symbols) : "";
  return generatePassword(length, chars);
};
const seedRolesPermissions = async () => {
  try {
    // Find the role to which you want to add permissions
    const role = await roleModel.findOne({ where: { name: "admin" } });
    const permissionsIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
    // Find the permissions you want to associate with the role
    const permissionsToAdd = await permissionModel.findAll({
      where: { id: permissionsIds },
    });
    const genertedPassword = createPassword(8, true, true);
    const hash = await bcrypt.hash(genertedPassword, 10);
    // Associate the permissions with the role
    await role.addPermissions(permissionsToAdd);
    let userObj = {
      firstName:"admin",
      lastName:"admin",
      email:"sofiatech2023@yopmail.com",
      password: hash,
      phoneNumber:"25910687",
      department:"it",
      position:"it",
      roleId:1,
    };

    await userModel.create(userObj)
    emailNotifications.sendUserAuth(userObj.firstName,userObj.lastName,userObj.email, genertedPassword);
    console.log("Permissions added to the role successfully.");
  } catch (error) {
    console.error("Error adding permissions to the role:", error);
  }
}
async function checkAndRunRoleSeeder(queryInterface, Sequelize) {
  const isEmpty = await isRoleAdminExists();
  if (isEmpty == false) {
    console.log("Admin role doesn't exist. Running seeder...");
    try {
      await roleSeeder.up(queryInterface, Sequelize);
      await seedRolesPermissions()
       // Execute the seeder
      console.log('Admin seeder executed successfully.');
      return true
    } catch (error) {
      console.error('Error executing role seeder:', error);
    }
  }
  else {
    console.log('role admin exists. Skipping role seeder.');
    return false
  }
}

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
    // Check if the permissions table is empty and execute the seeder if needed
    checkAndRunSeeder(sequelize.getQueryInterface(), sequelize.constructor);
  })
  .then(
    checkAndRunRoleSeeder(sequelize.getQueryInterface(), sequelize.constructor)
  )
  .catch((err) => {
    console.log("Error" + err.message);
  });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/role', rolesRouter);
app.use('/permission',permissionsRouter)
app.use('/auth', authRouter)
app.use('/project', projectRouter)
app.use('/phase', phaseRouter)
app.use('/task', taskRouter)
app.use('/trail', trailRouter)
app.use('/meeting', meetingRouter)
app.use('/room', roomRouter)
app.use("/files", fileRouter)
app.use('/message', messageRouter)
app.use('/notification', notificationRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const currentMinute = new Date().getMinutes();
const scheduledMinute = (currentMinute + 59) % 60;

cron.schedule(`${scheduledMinute} * * * *`, async () => {
  try {
    const today = new Date();
    const projects = await projectModel.findAll({
      include: {
        model: phaseModel,
        as: 'phases',
        where: {
          [Op.and]: [
            { startdate: { [Op.not]: null } }, 
            { enddate: { [Op.not]: null } }   
          ]
        }
      },
    });
    for (const project of projects) {
      for (const phase of project.phases) {
        if (new Date(phase.startDate).toDateString() === today.toDateString()) {
          phase.status = consts.taskStatus.inProgress;
          await phase.save();
        } 
        const prevPhaseIndex = project.phases.indexOf(phase) - 1;
        if (prevPhaseIndex >= 0) {
          const prevPhase = project.phases[prevPhaseIndex];
          const prevPhaseEndDate = new Date(prevPhase.endDate);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          if (prevPhase.status === consts.taskStatus.inProgress && prevPhaseEndDate.toDateString() === yesterday.toDateString()) {
            prevPhase.status = consts.taskStatus.completed;
            await prevPhase.save();
          }
        }
      }
    }
  } catch (error) {
    console.error('Scheduled task error:', error);
  }
});

module.exports = { app, httpServer};
