<template>
    <div class="information">
        <h1 style="font-size: 1.5em;">Información de los Usuarios</h1>
        <div>
            <input v-model="busqueda" type="text" class="buscar-input" placeholder="Buscar">
            <button @click="mostrarRegistro = true" class="registrar-btn">Registrar Usuario</button>
        </div>
        <div class="table-container">
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in usuariosFiltrados" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.estado }}</td>
                        <td>{{ user.rol }}</td>
                        <td>
                            <button @click="editarUsuario(user)" class="editar-btn">Editar</button>
                            <button @click="confirmarEliminacion(user.id)" class="eliminar-btn">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-footer">
            <div class="pagination">
                <span class="registros-text">Registros por página:</span>
                <button v-for="opcion in opcionesPagina" :key="opcion" :class="{ active: opcion === registrosPorPagina }"
                    @click="cambiarRegistrosPorPagina(opcion)">
                    {{ opcion }}
                </button>
            </div>
            <div class="total-registros">
                <span v-if="busqueda === ''">Total registros: {{ totalRegistros }} </span>
                <span v-else>Total registros: {{ usuariosFiltrados.length }}</span>
            </div>
        </div>
        <editar-usuario-modal :usuario-seleccionado="usuarioSeleccionado" :show-modal="showModal"
            @guardar-usuario="guardarUsuario" @cancelar-edicion="cancelarEdicion"></editar-usuario-modal>
        <registrar-usuario-modal v-if="mostrarRegistro" :show-modal="mostrarRegistro" @registrar-usuario="registrarUsuario"
            @cancelar-registro="cancelarRegistro"></registrar-usuario-modal>
    </div>
</template>

<script>
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import EditarUsuarioModal from './EditarUsuarioModal.vue';
import RegistrarUsuarioModal from './RegistrarUsuarioModal.vue';

export default {
    name: 'Account',
    components: {
        EditarUsuarioModal,
        RegistrarUsuarioModal,
    },
    data() {
        return {
            ListaUsuarios: [],
            loaded: true,
            usuarioSeleccionado: null,
            showModal: false,
            mostrarRegistro: false,
            sortOrder: 'asc',
            busqueda: '',
            registrosPorPagina: 5,
            paginaActual: 5,
            opcionesPagina: [5, 10, 25],
        };
    },
    methods: {
        cambiarRegistrosPorPagina(opcion) {
            this.registrosPorPagina = opcion;
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
            let userId = jwt_decode(token).user_id.toString();
            axios
                .get('http://127.0.0.1:8000/users/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { search: this.busqueda }
                })
                .then((result) => {
                    this.ListaUsuarios = result.data;
                    this.loaded = false;
                    this.ordenarTabla();
                    this.filtrarUsuarios();
                    this.totalRegistros = this.ListaUsuarios.length;;
                })
                .catch((error) => {
                    this.$emit('logOut', error);
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
        ordenarTabla: function () {
            if (this.ListaUsuarios) {
                this.ListaUsuarios.sort((a, b) => {
                    if (this.sortOrder === 'asc') {
                        return a.id - b.id;
                    } else {
                        return b.id - a.id;
                    }
                });
            }
        },
        editarUsuario: function (usuario) {
            this.usuarioSeleccionado = { ...usuario };
            this.showModal = true;
        },
        toggleOrden: function () {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.ordenarTabla();
            this.filtrarUsuarios();
        },
        guardarUsuario: function (usuarioActualizado) {
            if (usuarioActualizado.password === usuarioActualizado.originalPassword) {
                delete usuarioActualizado.password;
            } else {
                usuarioActualizado.password = make_password(usuarioActualizado.password);
            }
            axios
                .put(`http://127.0.0.1:8000/users/${usuarioActualizado.id}/`, usuarioActualizado, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token_access')}` },
                })
                .then((response) => {
                    alert('Usuario actualizado exitosamente.');
                    this.getData();
                    this.ordenarTabla();
                })
                .catch((error) => {
                    alert('Error al actualizar el usuario.');
                });
            this.showModal = false;
        },
        confirmarEliminacion: function (idUsuario) {
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                this.eliminarUsuario(idUsuario);
            }
        },
        eliminarUsuario: function (idUsuario) {
            axios
                .delete(`http://127.0.0.1:8000/users/${idUsuario}/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token_access')}` },
                })
                .then((response) => {
                    alert('Usuario eliminado exitosamente.');
                    this.getData();
                })
                .catch((error) => {
                    alert('Error al eliminar el usuario.');
                });
        },
        cancelarEdicion: function () {
            this.showModal = false;
        },
        mostrarRegistroUsuario: function () {
            this.mostrarRegistro = true;
        },
        cancelarRegistro: function () {
            this.mostrarRegistro = false;
        },
        registrarUsuario: function (nuevoUsuario) {
            axios
                .post('http://127.0.0.1:8000/userCreate/', nuevoUsuario, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token_access')}` },
                })
                .then((response) => {
                    alert('Usuario registrado exitosamente.');
                    this.getData();
                })
                .catch((error) => {
                    alert('Error al registrar el usuario.');
                });
            this.mostrarRegistro = false;
        },
        cumpleCriterioBusqueda: function (usuario, busqueda) {
            const searchFields = ['id', 'username', 'name', 'email', 'estado', 'rol'];
            for (let field of searchFields) {
                if (usuario[field] && usuario[field].toString().toLowerCase().includes(busqueda.toLowerCase())) {
                    return true;
                }
            }
            return false;
        },
    },
    computed: {
        usuariosFiltrados: function () {
            if (this.busqueda) {
                const busquedaMinuscula = this.busqueda.toLowerCase();
                return this.ListaUsuarios.filter(user => {
                    return (
                        user.id.toString().includes(busquedaMinuscula) ||
                        user.username.toLowerCase().includes(busquedaMinuscula) ||
                        user.name.toLowerCase().includes(busquedaMinuscula) ||
                        user.email.toLowerCase().includes(busquedaMinuscula) ||
                        user.estado.toLowerCase().includes(busquedaMinuscula) ||
                        user.rol.toLowerCase().includes(busquedaMinuscula)
                    );
                })
            } else {
                return this.ListaUsuarios.slice(0, this.registrosPorPagina);
            }
        },
        totalRegistros() {
            return this.ListaUsuarios.length;
        },
    },
    mounted() {
        this.getData();
    },
};
</script>

<style scoped>
.information {
    padding: -10em;
    margin: 0em;
    align-items: center;
    font-size: 15px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    position: relative;
}

.registrar-btn {
    padding: 0.5em;
    margin: 10px;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
    transition: opacity 0.3s ease;
}

.buscar-input {
    width: 400px;
    height: 40px;
    padding: 0.5em;
    margin: 10px;
}

.table-container {
    overflow-y: auto;
    overflow-x: auto;
    max-height: 320px;
    display: flex;
    justify-content: center;
    flex-grow: 1;
    position: relative;
    margin-bottom: 1em;
}

.table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    white-space: nowrap;
    max-width: 1500px;
    margin: 0 auto;
}

.table th,
.table td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table th {
    background-color: #585a5e;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
}

.table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: -10em;
    position: sticky;
    bottom: 0em;

}

.editar-btn,
.eliminar-btn {
    padding: 0.5em 1em;
    margin-right: 0.5em;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
    transition: opacity 0.3s ease;
}

.editar-btn {
    background-color: #d8d837;
}

.eliminar-btn {
    background-color: #f44336;
}

.editar-btn:hover,
.eliminar-btn:hover {
    opacity: 0.8;
}

.editar-usuario-modal,
.registrar-usuario-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 2em;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow-x: auto;
    white-space: nowrap;
    margin-right: 65em;
    margin-bottom: 3em;
}

.total-registros {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow-x: auto;
    white-space: nowrap;
    margin-right: 1em;
    margin-bottom: 4em;
    font-weight: bold;
}

.pagination span {
    margin-right: 0.5em;
    font-weight: bold;
}

.pagination button {
    padding: 0.5em 1em;
    margin-right: 0.5em;
    border: none;
    background-color: rgb(162, 157, 157);
    color: #000000;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.pagination button.active {
    background-color: #625d5d;
    color: white;
}

.pagination button:hover {
    background-color: #393c3e;
}

.registrar-btn {
    margin-bottom: 1em;
    padding: 0.75em 1em;
    border: none;
    background-color: #555b60;
    color: white;
    cursor: pointer;
    font-weight: bold;
    border-radius: 4px;
    transition: opacity 0.3s ease;
}

.registrar-btn:hover {
    opacity: 0.8;
}

.buscar-input {
    margin-bottom: 1em;
    width: 300px;
    padding: 0.75em;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: box-shadow 0.3s ease;
}

.buscar-input:focus {
    outline: none;
    box-shadow: 0 0 4px #2196f3;
}
</style>
