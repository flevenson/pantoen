
exports.seed = function(knex, Promise) {

  return knex('palettes').del()
    .then (() => knex('projects').del())

    .then(() => {

      return Promise.all([
        knex('projects').insert({
        id: 1, name: 'project_1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert({
            name: 'pallete one', 
            id: 1, 
            color_1: 'red', 
            color_2: 'blue', 
            color_3: 'orange', 
            color_4: 'magenta', 
            color_5: 'cornflowerblue', 
            project_id: project[0]
          }, 'id')
        })
        .then(() => console.log('Properly Seeded :D'))
        .catch(error => console.log(`Error seeding: ${error}`))  
      ])
    })
    .catch(error => console.log(`Error seeding: ${error}`))
};
