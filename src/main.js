import EditInPlace from './EditInPlace'

const VueEditInPlace = {}
VueEditInPlace.install = function (Vue) {
  
  Vue.directive('editinplace', {
    inserted(el, binding, vnode) {
      el.style.cursor = 'pointer'
      el.ondblclick = () => {
        EditInPlace.init({ el, binding, vnode })
      }
    },
  })
}

export default VueEditInPlace

