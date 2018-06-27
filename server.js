const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 8000);

app.locals.projects = [
  {id: 12345, name: 'ProjAlpha'},
  {id: 23456, name: 'ProjBeta'},
  {id: 34567, name: 'ProjGamma'}
];
app.locals.palettes = [
  {id: 1, name: 'spring', palette: ['#ECDB54', '#00A68C', '#E34132', '#645394', '#6CAODC'], project_id: 12345 },
  {id: 2, name: 'earth', palette: ['#8F3B1B', '#D57500', '#DBCA69', '#404F24', '#668D3C'], project_id: null}
];

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (request, response) => {});

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects);
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const project = app.locals.projects.find(project => project.id.toString() === id);

  response.status(200).json(project);
});

app.get('/api/v1/palettes', (request, response) => {
  response.status(200).json(app.locals.palettes);
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const palette = app.locals.palettes.find(palette => palette.id.toString() === id);
  
  response.status(200).json(palette);
});

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now().toString();
  const { name } = request.body;

  if (!name) {
    response.status(422).send({ error: 'No name property provided' });
  } else {
    app.locals.projects.push({ id, name });
    response.status(201).json({ id, name });
  }
});

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now().toString();
  const { name, palette } = request.body;

  if (!name || !palette) {
    response.status(422).send({ error: 'Please provide both name and palette properties' });
  } else {
    app.locals.palettes.push({ id, name, palette });
    response.status(201).json({ id, name, palette });
  }
});

app.put('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const { name } = request.body;
  const updatedProject = app.locals.projects.findIndex(project => project.id.toString() === id);

  if (updatedProject < 0) {
    response.status(404).send('SORRY! ID DOES NOT EXIST');
  } else if (!name) {
    response.status(422).send({ error: 'No name property provided. Object remains unchanged' });
  } else {
    app.locals.projects.splice(updatedProject, 1, { id, name });
    response.status(200).json({ id, name });
  }
});

app.put('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const { name, palette, project_id } = request.body;
  const updatedPalette = app.locals.palettes.find(palette => palette.id.toString() === id);

  if (updatedPalette < 0) {
    response.status(404).send('SORRY! ID DOES NOT EXIST');
  } else if (!name || !palette || !project_id) {
    response.status(422).send({ error: 'Required properties not provided. Please provide name, palette, and project_id properties'});
  } else {
    app.locals.palettes.splice(updatedPalette, 1, { id, name, palette, project_id });
    response.status(200).json({ id, name, palette, project_id });
  }
});

app.listen(app.get('port'), () => {
  console.log('Palette Picker listening on 8000');
});

app.use((request, response, next) => {
  response.status(404).send('SORRY! PAGE NOT FOUND');
});
