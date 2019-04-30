const knex = require('knex');
const express = require('express');

const router = express.Router();

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

router.post('/', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const newZoo = await db('zoos').insert(req.body, 'id');
      res.status(201).json(newZoo);
    } else {
      res.status(400).json({message: 'Please provide a name to create a zoo.'});
    }
  } catch (error) {
    res
      .status(500)
      .json({errorMessage: 'Error while adding new zoo to the database.'});
  }
});

router.get('/', async (req, res) => {
  try {
    const zoos = await db('zoos');

    res.status(200).json(zoos);
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving the zoos in the database'});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const foundZoo = await db('zoos')
      .where({id: req.params.id})
      .first();
    if (foundZoo) {
      res.status(200).json(foundZoo);
    } else {
      res.status(404).json({message: 'Zoo not found'});
    }
  } catch (error) {
    res
      .status(500)
      .json({message: 'Error retrieving the zoo from the database'});
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const editedZoo = await db('zoos')
        .where({id: req.params.id})
        .update(req.body);
      if (editedZoo) {
        res.status(200).json(editedZoo);
      } else {
        res.status(404).json({message: `Zoo doesn't exist`});
      }
    } else {
      res.status(400).json({message: 'Please provide a name to edit the zoo.'});
    }
  } catch (error) {
    res
      .status(500)
      .json({errorMessage: 'Error while editing zoo in the database.'});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedZoo = await db('zoos')
      .where({id: req.params.id})
      .delete(req.body);
    if (deletedZoo > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({message: 'Zoo not found.'});
    }
  } catch (error) {
    res
      .status(500)
      .json({errorMessage: `Error while deleting the zoo in the database.`});
  }
});

module.exports = router;
