const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());

app.use(express.static('public'));

app.locals.title = 'Projects';

app.locals.projects = [
{id: 1, name: 'Project One'},
{id: 2, name: 'Project Two'}
]

app.locals.palettes = [
{name: 'pallete one', id:1, color_1: 'red', color_2: 'blue', color_3: 'orange', color_4: 'magenta', color_5: 'cornflowerblue', project_id:1},
{name: 'pallete two', id:2, color_1: 'yellow', color_2: 'white', color_3: 'grey', color_4: 'orange', color_5: 'pink', project_id:2},
{name: 'pallete three', id:3, color_1: 'pink', color_2: 'black', color_3: 'blue', color_4: 'red', color_5: 'white', project_id:1}
]

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects)      
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then((projects) => {
      response.status(200).json(projects)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
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

// app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
//   const palettes = app.locals.palettes
//   console.log(palettes)
//   const id = parseInt(request.params.project_id)
//   const foundPalettes = palettes.filter(pallet => pallet.project_id === id)
//   if(!foundPalettes) {
//     return response.status(404).json({
//       error: `Project with an id of ${id} was not found.`
//     })
//   }
//   return response.status(200).json(foundPalettes)
// })

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.project_id).select()
    .then((palettes) => {
      response.status(200).json(palettes)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  const pallet = request.body
  const project_id  = parseInt(request.params.project_id)
  const id = app.locals.palettes[app.locals.palettes.length - 1].id + 1;

  for(let requiredParameter of ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5']) {
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