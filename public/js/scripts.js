const getProjectsAndPalettes = (projects) => {
  const unresolvedPromises = projects.map(project => {
    return  fetch(`/api/v1/projects/${project.id}/palettes`) 
            .then(response => response.json())
            .then(palettes => {
              return {
                project,
                palettes
              }
            }); 
  });
  return Promise.all(unresolvedPromises)
};

const persistData = () => {

  fetch('/api/v1/palettes')
  .then(response => response.json())
  .then(palettes => palettes.forEach(palette => appendPalettes(palette.id)));

  fetch('/api/v1/projects')
  .then(response => response.json())
  .then(projects => {
    getProjectsAndPalettes(projects)
    .then(data => {
      data.forEach(proj => {
        const { project, palettes } = proj;

        $('.saved-projects-list').append(`
           <span class="delete-project" >X</span><ul class="project" id=${project.id}>${project.name}</ul>
        `)

        palettes.forEach(palette => {
          $('.saved-projects-list').append(`
            <li class="palette" id=${palette.id}>${palette.name}
              <div class="saved-palette" style="background-color: ${palette.color1}"></div>
              <div class="saved-palette" style="background-color: ${palette.color2}"></div>
              <div class="saved-palette" style="background-color: ${palette.color3}"></div>
              <div class="saved-palette" style="background-color: ${palette.color4}"></div>
              <div class="saved-palette" style="background-color: ${palette.color5}"></div>
              <button class="delete-button"></button>
             </li>
          `)
        });
      });
    });
  });
  // });  

}

$(document).ready(persistData);

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
     
    if (!$('.box' + i).hasClass('lock')) { 
      $('.box' + i).css('background-color', colorCode);
      $('.box' + i).text(`${colorCode}`)
      palette.push(colorCode);
    }
  }
};

$('.generate-palette-button').on('click', generatePalette);
$('.box1').click(() => $('.box1').toggleClass('lock'));
$('.box2').click(() => $('.box2').toggleClass('lock'));
$('.box3').click(() => $('.box3').toggleClass('lock'));
$('.box4').click(() => $('.box4').toggleClass('lock'));
$('.box5').click(() => $('.box5').toggleClass('lock'));


const appendPalettes = (paletteId) => {
  fetch(`/api/v1/palettes/${paletteId}`)
    .then(response => response.json())
    .then(palette => {
      const { id, name, color1, color2, color3, color4, color5 } = palette[0];

      $('.saved-palettes-list').append(`
        <li class="palette" id=${id}>${name}
          <div class="saved-palette" style="background-color: ${color1}"></div>
          <div class="saved-palette" style="background-color: ${color2}"></div>
          <div class="saved-palette" style="background-color: ${color3}"></div>
          <div class="saved-palette" style="background-color: ${color4}"></div>
          <div class="saved-palette" style="background-color: ${color5}"></div>
          <button class="delete-button"></button>
        </li>
      `);

    });
}


const addToSavedPalettes = () => {
  const name = $('.input-palette-name').val();

  fetch('/api/v1/palettes', {
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

function deleteFromPalettes() {
  const { id } = $(this).parent()[0];

  if ($('.saved-items-container').find(`#${id}`).length > 1) {
    alert('This palette belongs to a project. You must delete from Project folder')
  } else {

    fetch(`/api/v1/palettes/${id}`, {
      method: 'DELETE'
    })
    .then(response => console.log('status is ' + response.status))

    $(this).parent().remove();
  }
}

$('.save-palette-button').on('click', addToSavedPalettes);
$('.saved-palettes-list').on('click', '.delete-button', deleteFromPalettes)

const appendProjects = (projectId) => {
  fetch(`/api/v1/projects/${projectId}`)
    .then(response => response.json())
    .then(project => {
      const { id, name } = project[0];

      $('.saved-projects-list').append(`
        <span class="delete-project" >X</span><ul class="project" id=${id}>${name}</ul>
      `);

    });
}

const addToSavedProjects = () => {
  const name = $('.input-project-name').val();

  fetch('/api/v1/projects', {
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

let selectedPalette;
let selectedProject;

function selectPalette() {
  $(this).css('border', 'solid thin');
  selectedPalette = $(this).clone();

  fetch(`/api/v1/palettes/${this.id}`)
  .then(response => response.json())
  .then(palette => {
    const { color1, color2, color3, color4, color5 } = palette[0];

    $('.box1').css('background-color', color1);
    $('.box2').css('background-color', color2);
    $('.box3').css('background-color', color3);
    $('.box4').css('background-color', color4);
    $('.box5').css('background-color', color5);
  });
}

function selectProject() {
  $(this).css('border', 'solid thin');
  selectedProject = this;
}

$('.saved-items-container').on('click', '.palette', selectPalette);
$('.saved-projects-list').on('click', '.project', selectProject);

const addForeignKeyToPalette = (paletteId, projectId) => {
  fetch(`/api/v1/palettes/${paletteId}`, {
    body: JSON.stringify({ project_id: projectId }),
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log(data));
}

const addPaletteToProject = () => {
  $(selectedProject).append(selectedPalette);

  const paletteId = selectedPalette[0].id;
  const projectId = selectedProject.id;

  addForeignKeyToPalette(paletteId, projectId);
}

function deleteFromProjects() {
  const { id } = $(this).parent()[0]

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })

  $('.saved-palettes-list').find(`#${id}`).remove();

  $(this).parent().remove();
}

$('.save-to-project-button').on('click', addPaletteToProject);
$('.saved-projects-list').on('click', '.delete-button', deleteFromProjects);
