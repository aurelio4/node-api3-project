const express = require('express');
const db = require('./postDb')

const router = express.Router();
// GET: get all posts
router.get('/', async (req, res) => {
  try {
    const users = await db.get()
    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// GET: get post by ID
router.get('/:id', validatePostId, async (req, res) => {
  try {
    const id = req.params.id
    const postById = await db.getById(id)
    res.status(200).json(postById)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// DELETE: delete post by ID
router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const id = req.params.id
    await db.remove(id)
    res.status(200).json({ success: "Successfully deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// PUT: update post by ID
router.put('/:id', validatePostId, async (req, res) => {
  try { 
      const id = req.params.id
      const postToUpdate = await db.getById(id)
      const newPost = {
        ...postToUpdate,
        text: req.body.text
      }
      await db.update(id, newPost)
      res.status(200).json(newPost)
  } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const id = req.params.id
    const postById = await db.getById(id)
    if(!postById) {
      res.status(400).json({ error: `Couldn't find post with id:${id}` })
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
}

module.exports = router;
