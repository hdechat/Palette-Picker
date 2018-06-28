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

const appendPalettes = (paletteId) => {
  fetch(`http://localhost:8000/api/v1/palettes/${paletteId}`)
    .then(response => response.json())
    .then(palette => {
      const { id, name, color1, color2, color3, color4, color5 } = palette[0];

      $('.saved-palettes-list').append(`
        <li class="palette" id=${id}>${name}
          <div class="saved-palette" style="background-color: ${color1}" ></div>
          <div class="saved-palette" style="background-color: ${color2}"></div>
          <div class="saved-palette" style="background-color: ${color3}"></div>
          <div class="saved-palette" style="background-color: ${color4}"></div>
          <div class="saved-palette" style="background-color: ${color5}"></div>
        </li>
      `);

    });
}

const addToSavedPalettes = () => {
  const name = $('.input-palette-name').val();

  fetch('http://localhost:8000/api/v1/palettes', {
    body: JSON.stringify({
      name,
      color1: $('.box1').css('background-color'),
      color2: $('.box2').css('background-color'),
      color3: $('.box3').css('background-color'),
      color4: $('.box4').css('background-color'),
      color5: $('.box5').css('background-color')
    }),
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(paletteID => appendPalettes(paletteID.id));

  $('.input-palette-name').val('');
};

$('.save-palette-button').on('click', addToSavedPalettes);

const appendProjects = (projectId) => {
  fetch(`http://localhost:8000/api/v1/projects/${projectId}`)
    .then(response => response.json())
    .then(project => {
      const { id, name } = project[0];

      $('.saved-projects-list').append(`
        <li class="palette" id=${id}>${name}</li>
      `);

    });
}

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
  .then(data => appendProjects(data.id));
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
  console.log(selectedPalette)
}

$('.save-to-project-button').on('click', addPaletteToProject);
