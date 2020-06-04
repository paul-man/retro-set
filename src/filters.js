import Vue from "vue"

Vue.filter("stringify", str => JSON.stringify(str, null, 2))
Vue.filter("pretty", str => JSON.stringify(JSON.parse(str), null, 2))
