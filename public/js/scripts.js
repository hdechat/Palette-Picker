//Persist page
const getProjectsAndPalettes = projects => {
  const unresolvedPromises = projects.map(project => {
    return  fetch(`/api/v1/projects/${project.id}/palettes`) 
            .then(response => {
              if (response.status === 200) {
                return response.json().then(palettes => {
                  return { project, palettes }
                }); 
              } else {
                return {project, palettes: []}
              }
            })
            
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
    return getProjectsAndPalettes(projects)
  })
    .then(data => {
      data.forEach(proj => {
        const { project, palettes } = proj;

        $('.saved-projects-list').append(`
           <span class="delete-project" >X</span><ul class="project" id=${project.id}>${project.name}</ul>
        `)

        palettes.forEach(palette => {
          $('.saved-projects-list').append(`
            <li class="palette" id=${palette.id}>
              <p class="palette-name">${palette.name}</p>
              <section>
                <div class="saved-palette" style="background-color: ${palette.color1}"></div>
                <div class="saved-palette" style="background-color: ${palette.color2}"></div>
                <div class="saved-palette" style="background-color: ${palette.color3}"></div>
                <div class="saved-palette" style="background-color: ${palette.color4}"></div>
                <div class="saved-palette" style="background-color: ${palette.color5}"></div>
              </section>
            </li>
            <button class="delete-button"></button>
          `)
        });
      });
    });
}

$(document).ready(persistData);

//Generate colors
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

for (let i=1; i<6; i++) {
  $('.box' + i).click(() => $('.box' + i).toggleClass('lock'));  
}

//Palettes
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

const fetchProjects = () => {
  return fetch(`/api/v1/projects`)
  .then(response => response.json())
  .then(projects => projects)
}

const appendPalettes = (paletteId) => {

  fetch(`/api/v1/palettes/${paletteId}`)
    .then(response => response.json())
    .then(palette => {
      const { id, name, color1, color2, color3, color4, color5 } = palette[0];

      $('.saved-palettes-list').append(`
        <li class="palette" id=${id}>
          <select name="project" id="select-project-${paletteId}">
            <option value=null selected>Add to Project</option>
          </select>
          <p class="palette-name">${name}</p>
          <section>
            <div class="saved-palette" style="background-color: ${color1}"></div>
            <div class="saved-palette" style="background-color: ${color2}"></div>
            <div class="saved-palette" style="background-color: ${color3}"></div>
            <div class="saved-palette" style="background-color: ${color4}"></div>
            <div class="saved-palette" style="background-color: ${color5}"></div>
          </section>
        </li>
        <button class="delete-button"></button>
      `);
      return fetchProjects()
    })
      .then(data => {
        data.forEach(project => {
          $(`#select-project-${paletteId}`)
          .append(`<option value="${project.name}">${project.name}</option>`)
        });
      });
}

function deleteFromPalettes() {
  const { id } = $(this).prev()[0];

  if ($('.saved-items-container').find(`#${id}`).length > 1) {
    alert('This palette belongs to a project. You must delete from Project folder')
  } else {

    fetch(`/api/v1/palettes/${id}`, {
      method: 'DELETE'
    })
    .then(response => console.log('status is ' + response.status))

    $(this).prev().prev().remove();
    $(this).prev().remove();
    $(this).remove();
  }
}

$('.save-palette-button').on('click', addToSavedPalettes);
$('.saved-palettes-list').on('click', '.delete-button', deleteFromPalettes)

//Projects
const appendProjects = (projectId) => {

  fetch(`/api/v1/projects/${projectId}`)
    .then(response => response.json())
    .then(project => {
      const { id, name } = project[0];

      $('.saved-projects-list')
        .append(`
          <span class="delete-project" >X</span>
          <ul class="project" id=${id}>${name}</ul>
        `);

      document.querySelectorAll('select').forEach(select => {
        $(`#${select.id}`).append(`<option value="${name}">${name}</option>`)
      })
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

  $('.input-project-name').val('')
}

function deleteFromSavedProjects() {
  const projectId = ($(this).next().attr('id'));
  const paletteId = ($(this).next().next().attr('id'));

  if (paletteId) {
    return alert('Please delete all palettes from project first')
  }

  fetch(`/api/v1/projects/${projectId}`, {
    method: 'DELETE'
  });

  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  });

  document.querySelectorAll('select').forEach(select => {
    const projectName = $(this).next().text();
    $(select).children(`option:contains(${projectName})`).remove()
  });
  $(this).next().remove();
  $(this).remove(); 
}

$('.save-project-button').on('click', addToSavedProjects);
$('.saved-projects-list').on('click', 'span', deleteFromSavedProjects);

//Add Palette to Project
let selectedPalette;
let selectedProject;

const changeGeneratorColors = id => {
  fetch(`/api/v1/palettes/${id}`)
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

function selectPalette() {
  changeGeneratorColors(this.id)
}

function selectProject(event) {
  selectedProject = $('.saved-projects-list')
    .find(`ul:contains(${event.target.value})`)[0];
  selectedPalette = $(this).parent().clone();
  console.log(selectedProject)
  console.log(selectedPalette)
}

$('.saved-items-container').on('click', '.palette', selectPalette);
$('.saved-palettes-list').on('change', 'select', selectProject);


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
  console.log(selectedPalette, selectedProject)
  const paletteId = selectedPalette[0].id;
  const projectId = selectedProject.id;

  $(`.project#${projectId}`)
    .append(selectedPalette)
    .append(`<button class="delete-button"></button>`);

  addForeignKeyToPalette(paletteId, projectId);
  $('.project').find('select').hide();
}

$('.save-to-project-button').on('click', addPaletteToProject);

//Delete Palette from Projects
function deleteFromProjects() {
  const { id } = $(this).prev()[0];

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })

  $('.saved-palettes-list').find(`#${id}`).next().remove();
  $('.saved-palettes-list').find(`#${id}`).remove();

  $(this).prev().remove();
  $(this).remove();
}

$('.saved-projects-list').on('click', '.delete-button', deleteFromProjects);
