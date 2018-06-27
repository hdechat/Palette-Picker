
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({ name: 'ProjectAlpha' }, 'id')
        .then(project_id => {
          return knex('palettes').insert([
            {
              name: 'spring',
              palette: ['#ECDB54', '#00A68C', '#E34132', '#645394', '#6CAODC'],
              project_id: project_id[0]
            },
            {
              name: 'winter',
              palette: ['#8F3B1B', '#D57500', '#DBCA69', '#404F24', '#668D3C'],
              project_id: project_id[0]
            }
          ])
        })
        .then(() => console.log('seeding complete!'))
        .catch(error => console.log(`error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`error seeding data: ${error}`))
};
