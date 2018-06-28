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
  let palette = [];

  for (let i = 1; i <= 5; i++) {
    let colorCode = getRandomHexCode();

    while (palette.find(color => color === colorCode)) {
      colorCode = getRandomHexCode();
    }
     
    $('.box' + i).css('background-color', colorCode);
    palette.push(colorCode);
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

const appendPalettes = (newPalette) => {
  $('.saved-palettes-list').append(`
    <li class="palette" id=${newPalette.id}>${newPalette.name}
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
  appendPalettes(newPalette);
  $('.input-palette-name').val('');
};

$('.save-palette-button').on('click', addToSavedPalettes);

const addToSavedProjects = () => {
  const name = $('.input-project-name').val();

  fetch('http://localhost:8000/api/v1/projects', {
    body: JSON.stringify({ name }),
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => console.log(data));
}

$('.save-project-button').on('click', addToSavedProjects);

// save Palette to Project
let selectedPalette;
let selectedProject;

function selectPalette() {
  $(this).css('border', 'solid thin');
  selectedPalette = $(this).clone();
}

function selectProject() {
  $(this).css('border', 'solid thin');
  selectedProject = this;
}

$('.saved-palettes-list').on('click', '.palette', selectPalette);
$('.saved-projects-list').on('click', '.project', selectProject);


const addPaletteToProject = () => {
  $(selectedProject).append(selectedPalette);
}

$('.save-to-project-button').on('click', addPaletteToProject);
