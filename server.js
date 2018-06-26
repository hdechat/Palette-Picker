const express = require('express');
const app = express();

app.set('port', process.env.PORT || 8000);
// app.locals.title = 'Palette Picker';

app.use(express.static('public'));

app.get('/', (request, response) => {});

app.listen(app.get('port'), () => {
  console.log('Palette Picker listening on 8000');
});