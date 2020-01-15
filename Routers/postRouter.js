const express = require('express');
const router = express.Router();
const db = require('../data/db.js');


//POST - /api/posts -creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    db.insert(req.body)
    .then(post => {
        res.status(201).json(post);
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    })
})

//POST - /api/posts/:id/comments - creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req,res) => {
    const createComments = {...req.body, post_id: req.params.id}
    if (!createComments.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    else {
        db.findById(req.params.id)
        .then(post => {
            if (post.length > 0) {
                post.insertComment(createComments)
                .then(comment => {comments
                    res.status(201).json(comment);
                })
                .catch(error => {
                    res.status(500).json({error: "There was an error while saving the comment to the database"})
                })
            } 
            else {
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
        .catch(error => {
        res.status(500).json({error: "There was an error while saving the comment to the database"})
    })
    }
})

//GET - /api/posts - returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    db.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(error => {
        console.error();
        res.status(500).json({error: "The posts information could not be retrieved." })
    })
})

//GET - /api/posts/:id - returns a post object with the specified id
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts);
        }
        else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

//GET - /api/posts/:id/comments - returns an array of all the comment objects associated with the post with the specified id
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts);
        }
        else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error: "The comments information could not be retrieved." })
    })
})

//DELETE - /api/posts/:id - removes the post with the specified id and returns the deleted post object 
router.delete('/:id', (req, res) => {
    db.remove(req.params.id)
    .then(deletedPost => {
        if (deletedPost) {
            res.status(200).json(deletedPost)
        }
        else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(error => {
        res.status(500).json({error: "The post could not be removed"})
    })
})

//PUT - /api/posts/:id - updates the post with the specified id using the data from the request body. Returns the modified document NOT THE ORIGINAL
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {title, contents} = req.body;

    if (!title || !contents) {
        res.status(400).json({})
    }
    else {
        db.update(id, req.body)
        .then(updatePost => {
            if(updatePost > 0) {
                db.findById(id)
            .then(postID => {res.status(200).json(postID)})
            .catch(err => {res.status(500).json({error: "The post information could not be modified."})})
            }
            else {
                res.status(404).json({message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            res.status(500).json({error: "The post information could not be modified."})
        })
    }
})

module.exports = router;