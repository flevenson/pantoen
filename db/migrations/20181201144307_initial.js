
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table){
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true)
    }),

    knex.schema.createTable('palettes', )

  ])
};

exports.down = function(knex, Promise) {
  
};
