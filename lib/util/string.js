
const capitalize = (str) => {
  if (typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const sanifyParam = (param) => {
  return param.replace('(', '').replace(')', '').replace('\'', '').replace('\'', '')
}

module.exports = {
  capitalize,
  sanifyParam
}