import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
FontAwesomeIcon.name = 'font-awesome-icon';
const components = [
  FontAwesomeIcon
]

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  });
}

export default install
