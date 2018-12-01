const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static('public'));

app.locals.title = 'Projects';

app.locals.projects = [
{id: 1, name: 'Project One'},
{id: 2, name: 'Project Two'}
]

app.locals.palettes = [
{id:1, color_1: 'red', color_2: 'blue', color_3: 'orange', color_4: 'magenta', color_5: 'cornflowerblue', project_id:1},
{id:2, color_1: 'yellow', color_2: 'white', color_3: 'grey', color_4: 'orange', color_5: 'pink', project_id:2},
{id:3, color_1: 'pink', color_2: 'black', color_3: 'blue', color_4: 'red', color_5: 'white', project_id:1}
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

  for(let requiredParameter of ['name']) {
    if(!project[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: {name: <STRING>}. Missing the required parameter of ${requiredParameter}.`
      })
    }
  }

  app.locals.projects.push({ id, ...project})

  return response.status(201).json({id})
})

app.get('/api/v1/projects/:project_id/paletes', (request, response) => {
  const palettes = app.locals.paletts
  console.log(palettes)
  const id = parseInt(request.params.project_id)
  const foundPalettes = palettes.filter(pallet => pallet.project_id === id)
  if(!foundPalettes) {
    return response.status(404).json({
      error: `Project with an id of ${id} was not found.`
    })
  }
  return response.status(200).json(foundPalettes)
})

app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  const pallet = request.body
  const project_id  = parseInt(request.params.project_id)
  const id = app.locals.palettes[app.locals.palettes.length - 1].id + 1;

  for(let requiredParameter of ['color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
    if(!pallet[requiredParameter]) {
      return response.status(422).json({
        error: `Expected format: {name:<STRING>}. Missing the required parameter of ${requiredParameter}.`
      })
    } 
  }

  app.locals.palettes.push({ id, ...pallet, project_id})

  return response.status(201).json({id})
})


app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})