import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import LogIn from './components/LogIn.vue'
import SignUp from './components/SignUp.vue'
import Home from './components/Home.vue'
import Usuarios from './components/Usuarios.vue'
import Roles from './components/Roles.vue'
import Contratos from './components/Contratos.vue'
import Dependencias from './components/Dependencias.vue'
import Series from './components/Series.vue'
import SubSeries from './components/SubSeries.vue'
//import Dashboard from './components/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/user/login',
    name: 'logIn',
    component: LogIn
  },
  {
    path: '/user/signUp',
    name: 'signUp',
    component: SignUp
  },
  {
    path: '/user/home',
    name: 'home',
    component: Home
  },
  {
    path: '/user/usuarios',
    name: 'usuarios',
    component: Usuarios
  },
  {
    path: '/user/roles',
    name: 'roles',
    component: Roles
  },
  {
    path: '/user/contratos',
    name: 'contratos',
    component: Contratos
  },
  {
    path: '/user/dependencias',
    name: 'dependencias',
    component: Dependencias
  },
  {
    path: '/user/series',
    name: 'series',
    component: Series
  },
  {
    path: '/user/subSeries',
    name: 'subSeries',
    component: SubSeries
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
