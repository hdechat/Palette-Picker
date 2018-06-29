const express = require('express'); //import express
const app = express(); //create instance of express
const bodyParser = require('body-parser'); //import body-parser

app.use(bodyParser.json()); //binds the body parser function that the root. executed for every request.

app.set('port', process.env.PORT || 8000); //if no user environment, sets port to default of 8000

const environment = process.env.NODE_ENV || 'development'; //if no user environment is set, default to development
const configuration = require('./knexfile')[environment]; //imports environment object from knexfile
const database = require('knex')(configuration); //creates instance of knex middleware 

app.use(express.static('public')); //routes every request to start at the public directory

app.get('/', (request, response) => {}); //routes HTTP GET request for root. empty callback leads to 'landing page'

app.get('/api/v1/projects', (request, response) => { //routes GET request for projects
  database('projects').select() //SELECT * FROM projects
    .then(projects => response.status(200).json(projects)) //returns object with status code of 200 and projects array
    .catch(error => response.status(500).json({ error })); //if server error returns status 500 and error
});

app.get('/api/v1/projects/:id', (request, response) => { //routes HTTP GET request with dynamic param. for single project with given id
  database('projects').where('id', request.params.id).select() //SELECT * FROM projects WHERE id = [:id]
    .then(project => { //resolve promise and pass callback
      project.length //checks if there is anything returned
        ? response.status(200).json(project) //if so, returns object with status 200 and project object
        : response.status(404).json({error: `Could not find project with id: ${request.params.id}`}); // if not, assumes that the id requested does not exist and returns status 404 with error message
    })
    .catch(error => response.status(500).json({ error })); //if server error, returns status 500 and error
});

app.get('/api/v1/palettes', (request, response) => { //routes HTTP get request for palettes
  database('palettes').select() //SELECT * FROM palettes
    .then(palettes => response.status(200).json(palettes)) //returns object with response status 200 and palettes array
    .catch(error => response.status(500).json({ error })); // if server error returns status 500 and error
});

app.get('/api/v1/palettes/:id', (request, response) => { //routes HTTP GET request with dynamic param for single palette with given id
  database('palettes').where('id', request.params.id).select() //SELECT * FROM palettes WHERE id = [:id]
  .then(palette => { //resolve promise and pass callback
    palette.length //checks if anything returned
      ? response.status(200).json(palette) //if so, returns object with status 200 and palette object
      : response.status(404).json({error: `Could not find project with id: ${request.params.id}`}); //if not, assumes that the id requested does not exist and returns 404 with error message
  })
  .catch(error => response.status(500).json({ error })); //if server error, returns status 500 and error
});

app.get('/api/v1/projects/:id/palettes', (request, response) => { //routes HTTP GET request for all palettes referenced to the single project
  database('palettes').where('project_id', request.params.id).select() //SELECT * FROM palettes WHERE foreign key = primary key
  .then(palettes => { //resolve promise and pass callback
    palettes.length //checks if anything returnd
      ? response.status(200).json(palettes) //if so, returns object with status 200 and palettes array
      : response.sendStatus(204); // if not, assumes, no palettes are referenced to this project id and returns no content
    })
  .catch(error => response.status(500).json({ error})); //if server error, returns status 500 and error
});

app.post('/api/v1/projects', (request, response) => { //routes HTTP POST request to create project
  const project = request.body; //assigns request body object to variable
  if (!project.name || project.name === undefined) { //checks if the name properter exists
    response.status(422).send({  // if not, returns status 422 and error message
      error: `Expected format: { name: <String> }. You're missing a name property.`
    });
  } else {
    database('projects').insert(project, 'id') //creates new project INSERT INTO projects VALUES and return id
      .then(project => response.status(201).json({ id: project[0] })) //resolve promise and return status 201 and id
      .catch(error => response.status(500).json({ error })); //if server error, returns status 500 and error
  }
});

app.post('/api/v1/palettes', (request, response) => { //routes HTTP POST request to create palette
  const palette = request.body; //assigns request body object to variable

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) { //iterates through array, assigning each element to the variable of requiredParameter
    if (!palette[requiredParameter]) { //if palette object does not have the key/parameter
      return response.status(422).send({ //return status 422 and error message
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

  database('palettes').insert(palette, 'id') //if all requirements are met, creates new palette INSERT INTO palettes VALUES and return id
    .then(palette => response.status(201).json({ id: palette[0]})) //resolve promise and return status 201 and id
    .catch(error => response.status(500).json({ error})); //if server error, returns status 500 and error
});

app.put('/api/v1/projects/:id', (request, response) => { //routes HTTP POST request with dynamic param to update the project with the given id
  const update = request.body; //assigns the request body object to variable

  database('projects').where('id', request.params.id).update(update) //SELECT * FROM projects WHERE id = [:id]
    .then(project => { //resolve promise and pass callback
      project //checks if anything is returned
       ? response.status(200).json({ update: "successful" }) //if so, returns object with status 200 and success message object
       : response.status(404).json({ error: `Could not find project with id: ${request.params.id}`}) //if not, assumes the id requested does not exist and returns status 404 and error message.
    })
    .catch(error => response.status(500).json({ error })); //if server error, returns status 500 and error
});

app.put('/api/v1/palettes/:id', (request, response) => { //routes HTTP PUT request with dynamic param to update the palette with the given id
  const update = request.body; //assigns the request body object to variable

  database('palettes').where('id', request.params.id).update(update) //SELECT * FROM palettes WHERE id = [:id]
    .then(palette => { //resolve promise and pass callback
      palette //checks if anything is returned
        ? response.status(200).json({ update: "successful"}) //if so, returns object with status 200 and success message object
        : response.status(404).json({ error: `Could not find project with id: ${request.params.id}`}) //if not, assumes the id requested does not exist and returns status 404 and error message
    })
    .catch(error => response.status(500).json({ error })); //if server error, returns status 500 and error
});

app.delete('/api/v1/projects/:id', (request, response) => { //routes HTTP DELETE request with dynamic param
  database('projects').where('id', request.params.id).select() //checks if project exists with SELECT * FROM projects WHERE id = [:id]
    .then(project => { //resolve promise and pass callback
      if (!project.length) { //checks if there is anything returned
        response.status(404).json({error: `Could not find project with id: ${request.params.id}`}); //if not, assumes project id does not exist and returns status 404 and error message
      } else {
        database('projects').where('id', request.params.id).delete() //deletes project DELETE FROM projects WHERE id = [:id]
          .then(() => response.sendStatus(204)) //returns no content with status 204
          .catch(error => response.status(500).json({ error })); //if server error, returns status 500 and error
      }
    })
    .catch(error => response.status(500).json({ error })); //if server error, return status 500 and error
});

app.delete('/api/v1/palettes/:id', (request, response) => { //routes HTTP DELETE request with dynamic param
  database('palettes').where('id', request.params.id).select() //checks if palette exists with SELECT * FROM palettes
    .then(palette => { //resolve promise and pass callback
      if (!palette.length) { //checks if there is anything returned
        response.status(404).json({error: `Could not find palette with id: ${request.params.id}`}); //if not, assumes palette id does not exist and returns status 404 and error message
      } else {//
        database('palettes').where('id', request.params.id).delete() //deletes palette DELETE FROM palettes WHERE id = [:id]
          .then(() => response.sendStatus(204))//returns no content with status 204
          .catch(error => response(500).json({ error })); //if server error, return status 500 and error
      }
    })
    .catch(error => response.status(500).json({ error })); //if server error, return status and error
});

app.listen(app.get('port'), () => { //listens from port determined by app.set at top of file.
  console.log('Palette Picker listening on 8000'); //logs message when port is listening
});

app.use((request, response, next) => { //catch all for requests with no defined endpoints
  response.status(404).send('SORRY! PAGE NOT FOUND'); //return status 404 and display message
});

module.exports = app //exports app which is the express instance