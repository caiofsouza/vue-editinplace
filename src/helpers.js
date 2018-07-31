export const createEl = (element, attributes) => {
  const el = document.createElement(element)
  for (const attr in attributes) {
    if (attr === 'text') {
      const text = document.createTextNode(attributes[attr])
      el.appendChild(text)
    } else {
      el[attr] = attributes[attr]
    }
  }
  return el
}

export const getElementStyles = (el) => {
  return document.defaultView.getComputedStyle(el, null)
}

export const deepSet = (obj, value, path) => {
  let i
  path = path.split('.')
  for (i = 0; i < path.length - 1; i++)
    obj = obj[path[i]]

  obj[path[i]] = value
}
