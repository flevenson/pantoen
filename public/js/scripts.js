const randomizeBtn = document.querySelector('.randomize-btn')
const saveBtn = document.querySelector('.save-btn')
const createProjectBtn = document.querySelector('.create-project-btn')
const projectNameInput = document.querySelector('.project-name-input')
const locks = document.querySelectorAll('.lock')

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
    color.nextSibling.nextSibling.children[1].innerText = randomColor
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

locks.forEach(lock => lock.addEventListener('click', toggleLock))
randomizeBtn.addEventListener('click', randomizeColors)

// const createProject = (event)