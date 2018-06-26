// const palette = require('./Palette.js');

// palette generator

const getRandomHexCode = () => {
  const hexChars = '0123456789ABCDEF';
  let hex = '#';

  while (hex.length < 7) {
    const randomIndex = Math.floor(Math.random() * 16)

    hex += hexChars[randomIndex];
  }

  return hex;
};

const generatePalette = () => {
  for (let i = 1; i <= 5; i++) {
    let colorCode = getRandomHexCode();
    $('.box' + i).css('background-color', colorCode);
  }
};

$('.generate-palette-button').on('click', generatePalette);

// save palette
function Palette() {
  this.id = Date.now();
  this.name = $('.input-palette-name').val();
  this.colors = [
    $('.box1').css('background-color'),
    $('.box2').css('background-color'),
    $('.box3').css('background-color'),
    $('.box4').css('background-color'),
    $('.box5').css('background-color')
  ];
}

const appendPalette = (newPalette) => {
  $('.saved-palettes').append(`
    <li id=${newPalette.id}>${newPalette.name}
      <div class="saved-palette" style="background-color: ${newPalette.colors[0]}" ></div>
      <div class="saved-palette" style="background-color: ${newPalette.colors[1]}"></div>
      <div class="saved-palette" style="background-color: ${newPalette.colors[2]}"></div>
      <div class="saved-palette" style="background-color: ${newPalette.colors[3]}"></div>
      <div class="saved-palette" style="background-color: ${newPalette.colors[4]}"></div>
    </li>
  `);
}

const addToSavedPalettes = () => {
  let newPalette = new Palette();
  appendPalette(newPalette);
  $('.input-palette-name').val('');
};

$('.save-palette-button').on('click', addToSavedPalettes);
