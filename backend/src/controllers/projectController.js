const Project = require('../models/Project');

// List all projects
exports.listProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('members', '-password');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'members',
      '-password'
    );
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description, status, startDate, endDate, members } = req.body;
    const exists = await Project.findOne({ name });
    if (exists)
      return res
        .status(409)
        .json({ error: 'Project with this name already exists.' });
    const project = new Project({
      name,
      description,
      status,
      startDate,
      endDate,
      members,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const project = await Project.findByIdAndUpdate(id, update, {
      new: true,
    }).populate('members', '-password');
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
