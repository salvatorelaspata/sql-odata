
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const sanifyParam = (param) => {
  return param.replace('(', '').replace(')', '').replace('\'', '').replace('\'', '')
}

module.exports = {
  capitalize,
  sanifyParam
}