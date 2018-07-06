const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('port', process.env.PORT || 8000);

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'));

app.get('/', (request, response) => {});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({ error}));
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(project => {
      project.length 
        ? response.status(200).json(project)
        : response.status(404).json({error: `Could not find project with id: ${request.params.id}`});
    })
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
  .then(palette => {
    palette.length
      ? response.status(200).json(palette)
      : response.status(404).json({error: `Could not find project with id: ${request.params.id}`});
  })
  .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
  .then(palettes => {
    palettes.length
      ? response.status(200).json(palettes)
      : response.sendStatus(200).json({});
    })
  .catch(error => response.status(500).json({ error}));
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if (!project.name || project.name === undefined) {
    response.status(422).send({ 
      error: `Expected format: { name: <String> }. You're missing a name property.`
    });
  } else {
    database('projects').insert(project, 'id')
      .then(project => response.status(201).json({ id: project[0] }))
      .catch(error => response.status(500).json({ error }));
  }
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format 
          { 
            name: <String>, 
            color1: <String>, 
            color2: <String>, 
            color3: <String>, 
            color4: <String>, 
            color5: <String>
          }. You're missing a "${requiredParameter}" property.`
      });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => response.status(201).json({ id: palette[0]}))
    .catch(error => response.status(500).json({ error}));
});

app.put('/api/v1/projects/:id', (request, response) => {
  const update = request.body;

  database('projects').where('id', request.params.id).update(update)
    .then(project => {
      project
       ? response.status(200).json({ update: "successful" })
       : response.status(404).json({ error: `Could not find project with id: ${request.params.id}`})
    })
    .catch(error => response.status(500).json({ error }));
});

app.put('/api/v1/palettes/:id', (request, response) => {
  const update = request.body;

  database('palettes').where('id', request.params.id).update(update)
    .then(palette => {
      palette
        ? response.status(200).json({ update: "successful"})
        : response.status(404).json({ error: `Could not find project with id: ${request.params.id}`})
    })
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(project => {
      if (!project.length) {
        response.status(404).json({error: `Could not find project with id: ${request.params.id}`});
      } else {
        database('projects').where('id', request.params.id).delete()
          .then(() => response.sendStatus(204))
          .catch(error => response.status(500).json({ error }));
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(palette => {
      if (!palette.length) {
        response.status(404).json({error: `Could not find palette with id: ${request.params.id}`});
      } else {
        database('palettes').where('id', request.params.id).delete()
          .then(() => response.sendStatus(204))
          .catch(error => response(500).json({ error }));
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log('Palette Picker listening on 8000');
});

app.use((request, response, next) => {
  response.status(404).send('SORRY! PAGE NOT FOUND');
});

module.exports = app