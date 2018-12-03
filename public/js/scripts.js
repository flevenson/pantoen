const randomizeBtn = document.querySelector('.randomize-btn')
const saveBtn = document.querySelector('.save-btn')
const createProjectBtn = document.querySelector('.create-project-btn')
const projectNameInput = document.querySelector('.project-name-input')
const locks = document.querySelectorAll('.lock')
const projectsNamesHolder = document.querySelector('.projects-names-holder')
const projectNamePalette = document.querySelector('.project-name-palette')
const paletteNamePalette = document.querySelector('.palette-name-palette')

const randomHexGenerator = () => {
  let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  let code = '#'
  return addDigits(code, digits)
}

const addDigits = (code, digits) => {

  if(code.length === 7){
    return code
  } else {
    const newLetter = digits[Math.floor(Math.random() * 15)]
    const newCode = code + newLetter
    return addDigits(newCode, digits)
  }
}

const randomizeColors = () => {
  const unlockedColors = document.querySelectorAll('.unlocked')
  unlockedColors.forEach(color => {
    const randomColor = randomHexGenerator()
    color.setAttribute('style', `background-color: ${randomColor}`)
    color.nextSibling.nextSibling.children[0].children[1].innerText = randomColor
  })
}

const toggleLock = () => {
  event.target.parentNode.parentNode.children[0].classList.toggle('unlocked')
  if(event.target.parentNode.parentNode.children[0].classList.contains('unlocked')){
    event.target.src='./assets/turquoise-lock.svg'
  } else {
    event.target.src='./assets/maroon-lock.svg'
  }
}

const createProjectHeading = (project) => {
  let projectHolder = document.createElement('ul')
  projectHolder.classList.add(`project${project.id}`)
  let projectHeading = document.createElement('li')
  projectHeading.classList.add('project-heading')
  projectHeading.innerText = project.name
  projectsNamesHolder.prepend(projectHolder)
  let correspondingProjectHolder = document.querySelector(`.project${project.id}`)
  correspondingProjectHolder.append(projectHeading)
}

const createProject = async () => {
  let url = '/api/v1/projects'
  let project = {
    name: projectNameInput.value 
  }
  try {
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(project),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    createProjectHeading(project)
    return await response.json()
  } catch(error) {
    return `Error: ${error}`
  }
}



const preventDefault = (event) => {
  event.preventDefault()
}

const clearProjectInput = () => {
  projectNameInput.value = ''
}

const populateProjects = async () => {
  let projects = await fetchProjects()
  projects.forEach(project => {
      createProjectHeading(project)
  })
}

const fetchProjects = async () => {
  let url = '/api/v1/projects'
  let response = await fetch(url)
  if (!response.ok) {
    throw new Error(response.statusText)
  } else {
    let results = await response.json();
    let projects = results.map(project => {
      return {
        name: project.name, 
        id: project.id
      }
    })
    return projects
  }
}

const createPaletteHTML = (projectID, palette) => {
  let correspondingHeading = document.querySelector(`.project${projectID}`)
  let colorHolder = document.createElement('ul')
  colorHolder.classList.add('color-holder')
  colorHolder.setAttribute('style', 'display: flex; align-items: center; margin-left: 20px; margin-bottom: 12px;')
  let color1 = createColorLi(palette.color_1)
  let color2 = createColorLi(palette.color_2)
  let color3 = createColorLi(palette.color_3)
  let color4 = createColorLi(palette.color_4)
  let color5 = createColorLi(palette.color_5)
  correspondingHeading.append(colorHolder)
  colorHolder.append(color1, color2, color3, color4, color5)
}

const createColorLi = (paletteColor) => {
  let color = document.createElement('li')
  color.setAttribute('style', `background-color: ${paletteColor}; height: 30px; width: 30px; margin-right: 10px;`)
  return color
}

const populatePalettes = async () => {
  let projectHeadings = document.querySelectorAll('.project-heading')
  let projects = await fetchProjects()
  projectHeadings.forEach( async (heading) => {
    let projectInDB = projects.find(project => project.name === heading.innerText)
    let url = `/api/v1/projects/${projectInDB.id}/palettes`
    let response = await fetch(url)
    if(!response.ok) {
      throw new Error(response.statusText)
    } else {
      let results = await response.json();
      let palettes = results.map(palette => {
        createPaletteHTML(projectInDB.id, palette)
      })
    }
  })
}

const savePalette = async () => {
  let projectName = projectNamePalette.value
  let paletteName = paletteNamePalette.value
  let colors = document.querySelectorAll('.color')
  let colorNames = []
  colors.forEach(color => colorNames.push(color.nextSibling.nextSibling.children[0].children[1].innerText))
  let palette = {
    name: projectName,
    color_1: colorNames[0],
    color_2: colorNames[1],
    color_3: colorNames[2],
    color_4: colorNames[3],
    color_5: colorNames[4]
  }
  let projects = await fetchProjects()
  let projectInDB = projects.find(project => project.name === projectName)
  let url = `/api/v1/projects/${projectInDB.id}/palettes`
  let response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(palette),
    headers: {
        'Content-Type': 'application/json'
    }
  })
  if(!response.ok) {
    throw new Error(response.statusText)
  } else {
    let results = await response.json();
    createPaletteHTML(projectInDB.id, palette)
  }
}

const loadPage = async () => {
  await populateProjects()
  populatePalettes()
}

loadPage()

locks.forEach(lock => lock.addEventListener('click', toggleLock))
randomizeBtn.addEventListener('click', randomizeColors)
createProjectBtn.addEventListener('click', preventDefault)
createProjectBtn.addEventListener('click', createProject)
createProjectBtn.addEventListener('click', clearProjectInput)
saveBtn.addEventListener('click', savePalette)

// const createProject = (event)