import { createEl, getElementStyles, deepSet } from './helpers'

const EditInPlace = {
  el: null,
  initialText: '',
  input: null,
  inputClassName: '',
  inputHeight: 0,
  styleEl: null,
  vnode: null,
  binding: null,
  init({ el, binding, vnode }) {
    this.vnode = vnode
    this.binding = binding
    this.el = el
    this.initialText = this.binding.expression ? this.vnode.context[this.binding.expression] : el.innerHTML
    this.inputHeight = el.clientHeight

    const vData = this.getVData(el)
    this.inputClassName = `edit-in-place-input-${ vData }`

    const styles = getElementStyles(el)
    this.cloneStylesTag(styles.cssText)

    this.createInput()
  },
  getVData(el) {
    const datasetProps = Object.keys(el.dataset)
    return datasetProps.find((prop) => prop.indexOf('v-', 0) === 0)
  },
  cloneStylesTag(cssText) {
    const styleText = `.${ this.inputClassName } { ${ cssText } }`
    const styleTag = createEl('style', {
      type: 'text/css',
      text: styleText
    })

    this.styleEl = styleTag
    document.head.appendChild(styleTag)
  },
  createInput() {
    const input = createEl('textarea', {
      className: this.inputClassName,
      value: this.initialText,
      onblur: this.saveChanges.bind(this),
      onkeydown: this.handleKeyDown.bind(this),
    })

    if (this.binding.expression) {
      if (this.binding.expression.indexOf('.') !== -1) {
        deepSet(this.vnode.context.$data, '', this.binding.expression)
      } else {
        Vue.set(this.vnode.context, this.binding.expression, '')
      }
    } else {
      this.el.style.display = 'none'
    }

    if (this.el.nextSibling) {
      this.el.parentNode.insertBefore(input, this.el.nextSibling)
    } else {
      this.el.parentNode.appendChild(input)
    }

    this.setInputHeight(input, input.scrollHeight)
    this.input = input
    input.focus()
  },
  handleKeyDown(event) {
    this.setInputHeight(this.input, this.input.scrollHeight)

    if (event.which === 27) {
      this.reverseChanges()
      return false
    }
    if (event.which === 13) {
      this.input.blur()
      return false
    }
  },
  setInputHeight(input, height) {
    input.style.height = `${ height }px`
    input.style.minHeight = `${ height }px`
    input.style.maxHeight = `${ height }px`
  },
  saveChanges() {
    const finalValue = this.input.value === '' ? this.initialText : this.input.value

    this.input.parentNode.removeChild(this.input)
    document.head.removeChild(this.styleEl)

    if (this.binding.expression) {
      if (this.binding.expression.indexOf('.') !== -1) {
        deepSet(this.vnode.context.$data, finalValue, this.binding.expression)
      } else {
        Vue.set(this.vnode.context, this.binding.expression, finalValue)
      }
    } else {
      this.el.style.display = 'initial'
    }

    const eventDetail = {
      detail: {
        oldValue: this.initialText,
        newValue: finalValue,
      },
    }

    if (this.vnode.componentInstance) {
      this.vnode.componentInstance.$emit('edit', eventDetail)
    } else {
      this.vnode.elm.dispatchEvent(new CustomEvent('edit', eventDetail))
    }
  },
  reverseChanges() {
    this.input.value = this.initialText
    this.saveChanges()
  },
}

export default EditInPlace