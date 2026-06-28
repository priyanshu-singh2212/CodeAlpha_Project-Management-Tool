const { getIO } = require("../socket");
const sendNotification = require("../utils/sendNotification");
const Project = require("../models/Project");
const Board = require("../models/Board");
const ActivityLog = require("../models/ActivityLog");

// Create Project
const createProject = async (req, res) => {
  console.log("BODY =", req.body);
  console.log("USER =", req.user);

  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });
// Default boards create
await Board.create([
  {
    title: "Todo",
    project: project._id,
  },
  {
    title: "In Progress",
    project: project._id,
  },
  {
    title: "Review",
    project: project._id,
  },
  {
    title: "Completed",
    project: project._id,
  },
]);

await ActivityLog.create({
  action: "Project Created",
  project: project._id,
  user: req.user.id,
  details: `${req.user.name} created project "${project.title}"`,
});

getIO().emit("projectCreated", project);

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Project By ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
  .populate("members", "name email")
  .populate("owner", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {

    const project = await Project.findByIdAndUpdate(
  req.params.id,
  req.body,
  {
    new: true,
    runValidators: true,
  }
);

if (!project) {
  return res.status(404).json({
    success: false,
    message: "Project not found",
  });
}

await ActivityLog.create({
  action: "Project Updated",
  project: project._id,
  user: req.user.id,
  details: `${req.user.name} updated project "${project.title}"`,
});

getIO()
  .to(`project_${project._id}`)
  .emit("projectUpdated", project);

    res.status(200).json({
      success: true,
      project,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
await ActivityLog.create({
  action: "Project Deleted",
  project: project._id,
  user: req.user.id,
  details: `${req.user.name} deleted project "${project.title}"`,
});
    await project.deleteOne();

getIO()
  .to(`project_${project._id}`)
  .emit("projectDeleted", {
    projectId: project._id,
  });

    res.status(200).json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Member
const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

   if (
  !project.members.some(
    (member) => member.toString() === memberId
  )
) {
  project.members.push(memberId);

  await project.save();
await project.populate([
  {
    path: "members",
    select: "name email",
  },
  {
    path: "owner",
    select: "name email",
  },
]);
const member = project.members.find(
  (m) => m._id.toString() === memberId
  );
  await ActivityLog.create({
  action: "Member Added",
  project: project._id,
  user: req.user.id,

details: `${req.user.name} added ${member.name} to project "${project.title}"`,
});

  getIO()
    .to(`project_${project._id}`)
    .emit("projectUpdated", project);

  await sendNotification({
    recipient: memberId,
    sender: req.user.id,
    type: "project_invitation",
    message: `You have been added to project "${project.title}"`,
    projectId: project._id,
  });
}
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Member
const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("owner", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Owner ko remove nahi kar sakte
    if (project.owner._id.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Owner cannot be removed",
      });
    }

    const member = project.members.find(
      (m) => m._id.toString() === memberId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    project.members = project.members.filter(
      (m) => m._id.toString() !== memberId
    );

    await project.save();

    await ActivityLog.create({
      action: "Member Removed",
      project: project._id,
      user: req.user.id,
      details: `${req.user.name} removed ${member.name} from project "${project.title}"`,
    });

    getIO()
      .to(`project_${project._id}`)
      .emit("projectUpdated", project);

    res.status(200).json({
      success: true,
      project,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};