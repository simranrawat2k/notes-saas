// src/routes/notes.js
const express = require('express');
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const auth = require('../middleware/auth');

const router = express.Router();

// Create note
// POST /api/notes
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });

  try {
    // check tenant plan / limit
    const tenant = req.tenant; // attached in auth middleware
    if (tenant.plan === 'free' && tenant.noteLimit != null) {
      const count = await Note.countDocuments({ tenantId: tenant._id });
      if (count >= tenant.noteLimit) {
        return res.status(403).json({ error: 'Note limit reached. Upgrade to Pro.' });
      }
    }

    const note = new Note({
      title,
      content,
      tenantId: req.user.tenantId,
      createdBy: req.user.id
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List notes for tenant
// GET /api/notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.user.tenantId }).sort({createdAt:-1});
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { title: req.body.title, content: req.body.content } },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
