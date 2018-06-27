
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
              color1: '#00A68C',
              color2: '#E34132',
              color3: '#645394',
              color4: '#6CAODC',
              color5: '#ECDB54',
              project_id: project_id[0]
            },
            {
              name: 'winter',
              color1: '#8F3B1B',
              color2: '#DBCA69',
              color3: '#404F24',
              color4: '#668D3C',
              color5: '#D57500',
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
