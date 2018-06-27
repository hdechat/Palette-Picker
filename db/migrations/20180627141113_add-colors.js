
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('palettes', table => {
      table.dropColumn('palette');
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');
      table.string('color5');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('palettes', table => {
      table.string('palette');
      table.dropColumn('color1');
      table.dropColumn('color2');
      table.dropColumn('color3');
      table.dropColumn('color4');
      table.dropColumn('color5');
    })
  ]);
};
