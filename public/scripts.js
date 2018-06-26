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
    $('.box' + i).css('background-color', getRandomHexCode());
  }
};

$('.generate-palette-button').on('click', generatePalette);

// save palette
function Palette() {
  this.id = Date.now();
  this.name = $('.input-palette-name').val();
}

const appendPalette = (newPalette) => {
  $('.saved-palettes').append(`
    <li id=${newPalette.id}>${newPalette.name}
    </li>
  `);
}

const addToSavedPalettes = () => {
  let newPalette = new Palette();
  appendPalette(newPalette);
};

$('.save-palette-button').on('click', addToSavedPalettes);
