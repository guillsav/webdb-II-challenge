const express = require('express');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bears = await db('bears');
    res.status(200).json(bears);
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while retrieving the bears from the database'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const foundBear = await db('bears')
      .where({id: req.params.id})
      .first();
    if (foundBear) {
      res.status(200).json(foundBear);
    } else {
      res.status(404).json({message: 'Bear not found.'});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error while retrieving the bear from the database'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const newBear = await db('bears').insert(req.body, 'id');
      res.status(201).json(newBear);
    } else {
      res
        .status(400)
        .json({message: 'Please provide a name to add a new bear.'});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error the bear could not be added to the database'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.name.length > 0) {
      const editedBear = await db('bears')
        .where({id: req.params.id})
        .update(req.body);
      if (!editedBear) {
        res.status(404).json({message: 'Bear not found'});
      } else {
        res.status(200).json(editedBear);
      }
    } else {
      res.status(400).json({message: 'Please provide name'});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error the bear information could not be modified.'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedBear = await db('bears')
      .where({id: req.params.id})
      .delete(req.body);
    if (deletedBear) {
      res.status(204).end();
    } else {
      res.status(404).json({message: 'Bear not found.'});
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: 'Error the could not be deleted from the database.'
    });
  }
});

module.exports = router;
