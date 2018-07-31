# VueEditInPlace

A edit-in-place directive which edit texts keeping all layouts of the target


# How to install

Run `npm install vue-editinplace --save`

Install in your Vue instance
```js
import Vue from 'vue'
import VueEditInPlace from 'vue-editinplace'

Vue.use(VueEditInPlace)
```


# How to use

VueEditInPlace exposes a directive called `v-editinplace`, and a custom event `@edit`, which contains an object with the old value and the new value
Examples:

Editing a data variable from an instance
```html
<template>
  <h2 v-editinplace="title">{{ title }}</h2>
</template>
<script>
  export default {
    data () {
      return {
        title: 'Hello World!'
      }
    }
  }
</script>
```

Get the modified value
```html
<template>
  <div>
    <h2 v-editinplace @edit="edit">{{ title }}</h2>
    <p>new value: {{ newValue }}</p>
    <p>old value: {{ oldValue }}</p>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        title: 'Hello World!',
        newValue: '',
        oldValue: ''
      }
    },
    methods: {
      edit (event) {
        this.newValue = event.detail.newValue
        this.oldValue = event.detail.oldValue
      }
    }
  }
</script>
```

# Tips

Editing a value inside a loop
```html
<template>
  <div>
    <!-- an array of strings -->
    <ul>
      <li 
        v-for="(fruit, index) in fruits" 
        :key="fruit"
        v-editinplace
        @edit="editList($event, index)">
          {{ fruit }}
      </li>
    </ul>

    <!-- an array of objects -->
    <div v-for="(user, index) in users" :key="user.email">
      <h4 v-editinplace @edit="editObject($event, index, 'name')">
        {{ user.name }}
      </h4>
      <h4 v-editinplace @edit="editObject($event, index, 'email')">
        {{ user.email }}
      </h4>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        fruits: ['Apple', 'Banana', 'Grape', 'Coconut', 'Melon'],
        users: [
          {
            name: 'Jorge',
            email: 'jorge@email.com'
          },
          {
            name: 'Caio',
            email: 'caio@email.com'
          },
          {
            name: 'Bruno',
            email: 'bruno@email.com'
          },
        ]
      }
    },
    methods: {
      editList (event, index) {
        this.fruits[index] = event.detail.newValue
      },
      editObject (event, index, attr) {
        this.users[index][attr] = event.detail.newValue
      }
    }
  }
</script>
```
