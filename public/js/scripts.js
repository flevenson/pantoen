document.querySelector()

const randomHexGenerator = () => {
  let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  let code = '#'
  console.log(addDigits(code, digits))
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