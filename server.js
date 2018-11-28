const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static('public'));

app.locals.title = 'Projects';

app.locals.projects = [
{id: 1, name: 'Pallet One'},
{id: 2, name: 'Pallet Two'}
]

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;

  return response.status(200).json(projects)
})

app.get('/api/v1/projects/:id', (request, response) => {
  const projects = app.locals.projects
  const id = parseInt(request.params.id)
  const foundProject = projects.find(project => project.id === id)
  if (!foundProject) {
    return response.status(404).json({
      error: `Project with an id of ${id} was not found.`
    })
  }
  return response.status(200).json(foundProject)
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  const id = app.locals.projects[app.locals.projects.length - 1].id + 1;

  for(let requiredParameter in ['name']) {
    if(!project[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: {name: <STRING>, type: <STRING>}. Missing the required parameter of ${requiredParameter}.`
      })
    }
  }

  app.locals.pets.push({ id ...project})

  return response.status(201).json({id})
})


app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})