<template>
  <div class="App">
    <div class="header">
      <title>Iniciar Sesion</title>
      <h1>Gestión de Contrataciones</h1>
      <div class="greetings">
        <label v-if="is_auth">Usuario: {{ usuario.name }}</label>
        <label v-if="is_auth">{{ rol }}</label>
      </div>
      <nav class="navbar">
        <button v-if="is_auth" v-on:click="loadHome" class="btn btn-primary">
          Inicio
        </button>
        <button v-if="is_auth && rol=='Administrador'" v-on:click="loadUsers" class="btn btn-primary">
          Usuarios
        </button>
        <button v-if="is_auth && rol=='Administrador'" v-on:click="loadRoles" class="btn btn-primary">
          Roles
        </button>
        <button v-if="is_auth && rol=='Administrador' || rol=='Digitador'" v-on:click="loadContratos" class="btn btn-primary">
          Contratos
        </button>
        <button v-if="is_auth && rol=='Administrador'" v-on:click="loadDependencias" class="btn btn-primary">
          Dependencias
        </button>
        <button v-if="is_auth && rol=='Administrador'" v-on:click="loadSeries" class="btn btn-primary">
          Series
        </button>
        <button v-if="is_auth && rol=='Administrador'" v-on:click="loadSubSeries" class="btn btn-primary">
          Subseries
        </button>
        <button v-if="is_auth && rol=='Administrador' || rol=='Supervisor'" v-on:click="loadUsers" class="btn btn-primary">
          Auditoría
        </button>
        <button v-if="is_auth && rol=='Administrador' || rol=='Supervisor'" v-on:click="loadUsers" class="btn btn-primary">
          Reportes
        </button>
        <button v-if="is_auth" v-on:click="logOut" class="btn btn-danger">
          Cerrar Sesión
        </button>
        <button v-if="!is_auth" v-on:click="loadLogIn" class="btn btn-primary">
          Iniciar Sesión
        </button>
        <button v-if="!is_auth" v-on:click="loadSignUp" class="btn btn-primary">
          Registrarse
        </button>
      </nav>
    </div>
    <div class="main-component">
      <router-view v-on:completedLogIn="completedLogIn" v-on:completedSignUp="completedSignUp">
      </router-view>
    </div>
    <div class="footer">
      <h2>Alcaldía Municipal de Valledupar</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function () {
    return {
      is_auth: false,
      username: localStorage.getItem("username"),
      usuario: '',
      rol:'',
    }
  },
  methods: {
    verifyAuth: function () {
      this.is_auth = localStorage.getItem("isAuth") || false;
      if (this.is_auth == false)
        this.$router.push({ name: 'logIn' })
      else
        this.$router.push({ name: "home" })
    },
    loadLogIn: function () {
      this.$router.push({ name: 'logIn' })
    },
    loadSignUp: function () {
      this.$router.push({ name: 'signUp' })
    },
    loadHome: function () {
      location.reload();
      this.$router.push({ name: 'home' })    
    },
    loadUsers: function () {
      this.$router.push({ name: 'usuarios' })
    },
    loadRoles: function () {
      this.$router.push({ name: 'roles' })
    },
    loadContratos: function () {
      this.$router.push({ name: 'contratos' })
    },
    loadDependencias: function () {
      this.$router.push({ name: 'dependencias' })
    },
    loadSeries: function () {
      this.$router.push({ name: 'series' })
    },
    loadSubSeries: function () {
      this.$router.push({ name: 'subSeries' })
    },
    logOut: function () {
      location.reload();
      localStorage.clear();
      alert("Sesión cerrada");
      this.verifyAuth();
    },
    completedLogIn: function (data) {
      location.reload();
      localStorage.setItem("token_access", data.token_access);
      localStorage.setItem("token_refresh", data.token_refresh);
      localStorage.setItem("username", data.username);
      localStorage.setItem("isAuth", true);
      alert("El inicio de sesión fue correcto");
      this.verifyAuth();
    },
    completedSignUp: function (data) {
      alert("El registro fue exitoso");
      this.completedLogIn(data)
    },
    getData: async function () {
      if (
        localStorage.getItem('token_access') === null ||
        localStorage.getItem('token_refresh') === null
      ) {
        this.$emit('logOut');
        return;
      }
      await this.verifyToken();
      let token = localStorage.getItem('token_access');
      // Obtener detalles del usuario
      axios
        .get(`http://127.0.0.1:8000/users/username/${this.username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          this.usuario = result.data;
          this.rol = this.usuario.rol.nombre
        })
        .catch((error) => {
          console.error('Error al obtener los detalles del usuario:', error);
        });
    },
    verifyToken: function () {
      return axios
        .post(
          'http://127.0.0.1:8000/refresh/',
          { refresh: localStorage.getItem('token_refresh') },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then((result) => {
          localStorage.setItem('token_access', result.data.access);
        })
        .catch(() => {
          this.$emit('logOut');
        });
    },
  },
  created: function () {
    this.verifyAuth()
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.greetings {
  position: absolute;
  flex-direction: column;
  display: flex;
  justify-content: center;
  font-size: 15px;

}

body {
  display: flex;
  flex-direction: column;
}

.App {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}

.header {
  background-color: #283747;
  color: #e5e7e9;
  align-items: center;
}

.header h1 {
  display: flex;
  font-size: 25px;
  margin: 5px;
  align-items: center;
  justify-content: center;
}

.navbar {
  display: flex;
  justify-content: center;
}

.btn-primary {
  color: #fff;
  background-color: #4d4e50;
  border-color: #000000;
  border-radius: 5px;
  padding: 10px 20px;
  margin-right: 10px;
}

.btn-primary:hover {
  color: #fff;
  background-color: #000000;
  border-color: #000000;

}

.btn-danger {
  color: #fff;
  background-color: #c22434;
  border-color: #000000;
  border-radius: 5px;
  padding: 10px 20px;
  right: 10px;
  position: absolute;
}

.btn-danger:hover {
  color: #fff;
  background-color: #e74c5c;
  border-color: #bd2130;
}

.main-component {
  height: 80vh;
  background-color: #fdfefe;
  padding: 20px;
}

.footer {
  background-color: #283747;
  color: #e5e7e9;
  padding: 20px;
  text-align: center;
  margin-top: auto;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.footer h2 {
  font-size: 20px;
  margin: 0;
}
</style>



