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
  let palette = [];

  for (let i = 1; i <= 5; i++) {
    let colorCode = getRandomHexCode();

    while (palette.find(color => color === colorCode)) {
      colorCode = getRandomHexCode();
    }
     
    palette.push(colorCode);
  }

  return palette;
};

module.exports = generatePalette;