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
  $('.box1').css('background-color', getRandomHexCode());
  $('.box2').css('background-color', getRandomHexCode());
  $('.box3').css('background-color', getRandomHexCode());
  $('.box4').css('background-color', getRandomHexCode());
  $('.box5').css('background-color', getRandomHexCode());
};

$('.generate-palette-button').on('click', generatePalette);