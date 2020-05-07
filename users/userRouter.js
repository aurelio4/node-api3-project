const express = require('express');
const db = require('./userDb')
const postsDb = require('../posts/postDb')

const router = express.Router();

// POST: adds a user
router.post('/', validateUser, async (req, res) => {
  try {
    const name = req.body.name
    if(!name) {
      res.status(400).json({ error: "Couldn't fulfill request" })
    } else {
      const userToAdd = { name }
      const addUser = await db.insert(userToAdd)
      res.status(201).json(userToAdd)
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// POST: add a post by user id
router.post('/:id/posts', validatePost, async (req, res) => {
  try {
    const id = req.params.id
    const { text, user_id } = req.body
    const user = await db.getById(user_id)
    if(!user) {
      res.status(400).json({ error: `cannot find user with id:${user_id}` })
      return
    }

    if(text) {
      const makePost = await postsDb.insert({ text, user_id })
      res.status(201).json(makePost)
    } else {
      res.status(400).json({ error: `cannot create post without text` })
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// GET: gets all users
router.get('/', async (req, res) => {
  try {
    const users = await db.get()
    res.status(200).json(users)
  } catch(err) {
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// GET: gets user by id
router.get('/:id', validateUserId, async (req, res) => {
  try {
    const id = req.params.id
    const userById = await db.getById(id)
    res.status(200).json(userById)
  } catch(err) {
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// GET: gets user by user id
router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const id = req.params.id
    const usersPosts = await db.getUserPosts(id)
    res.status(200).json(usersPosts)
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// DELETE: deletes user by id
router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const id = req.params.id
    const removedUser = await db.remove(id)
    if(!removedUser) {
      res.status(404).json({ error: `User at id:${id} doesn't exist` })
    } else {
      res.status(200).json({ success: "User deleted successfully "})
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
});

// PUT: updates user by id
router.put('/:id', validateUserId, async (req, res) => {
  try {
    const id = req.params.id
    const userToUpdate = await db.getById(id)
    if(!req.body.name) {
      res.status(400).json({ error: "Missing field" })
    } else {
      const newUser = {
        ...userToUpdate,
        name: req.body.name
      }
      const updatedUser = await db.update(id, newUser)
      res.status(200).json(newUser)
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  } 
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const id = req.params.id
    const userById = await db.getById(id)
    if(!userById) {
      res.status(400).json({ error: `Couldn't find user with id:${id}` })
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
}

function validateUser(req, res, next) {
  try {
    const user = req.body
    if(!user || !user.name) {
      res.status(400).json({ message: "missing user data" })
    } else {
      next()
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
}

async function validatePost(req, res, next) {
  try {
    const { text, user_id } = req.body
    const user = await db.getById(user_id)
    if(!user) {
      res.status(400).json({ error: `cannot find user with id:${user_id}` })
      return
    }

    if(text) {
      next()
    } else {
      res.status(400).json({ error: `cannot create post without text` })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Couldn't fulfill request" })
  }
}

module.exports = router;
