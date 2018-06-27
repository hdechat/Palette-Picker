const express = require('express');
const app = express();

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

app.use(express.static('public'));

app.get('/', (request, response) => {});

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects);
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const project = app.locals.projects.find(project => project.id === parseInt(id));

  response.status(200).json(project);
});

app.get('/api/v1/palettes', (request, response) => {
  response.status(200).json(app.locals.palettes);
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const palette = app.locals.palettes.find(palette => palette.id === parseInt(id));
  
  response.status(200).json(palette);
});

app.listen(app.get('port'), () => {
  console.log('Palette Picker listening on 8000');
});

app.use((request, response, next) => {
  response.status(404).send('SORRY! PAGE NOT FOUND');
});
