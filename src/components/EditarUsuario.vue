<template>
    <div class="modal" v-if="showModal">
        <div class="modal-content">
            <h2>Editar Usuario</h2>
            <form @submit.prevent="guardarUsuario">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" v-model="usuarioSeleccionado.username" required>
                </div>
                <div class="form-group">
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" v-model="usuarioSeleccionado.name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="usuarioSeleccionado.email" required>
                </div>
                <div class="form-group">
                    <label for="estado">Estado:</label>
                    <select id="estado" v-model="usuarioSeleccionado.estado" required>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="rol">Rol:</label>
                    <select id="rol" v-model="usuarioSeleccionado.rol.id" required>
                        <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ rol.nombre }}</option>
                    </select>
                </div>
                <div class="modal-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" @click="cancelarEdicion">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        usuarioSeleccionado: {
            type: Object,
            default: null,
        },
        showModal: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            nuevoUsuario: {
                username: null,
                name: null,
                email: null,
                estado: null,
                rol: null,
            },
            roles: [],
        };
    },
    mounted() {
        let token = localStorage.getItem('token_access');
        axios.get('http://127.0.0.1:8000/roles/', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                this.roles = response.data;
            })
            .catch(error => {
                console.error(error);
            });
    },
    methods: {
        guardarUsuario: function () {
            this.nuevoUsuario.username = this.usuarioSeleccionado.username;
            this.nuevoUsuario.name = this.usuarioSeleccionado.name;
            this.nuevoUsuario.email = this.usuarioSeleccionado.email;
            this.nuevoUsuario.estado = this.usuarioSeleccionado.estado;
            this.nuevoUsuario.rol = this.usuarioSeleccionado.rol.id;
            this.$emit('guardarUsuario', this.nuevoUsuario, this.usuarioSeleccionado.id);
        },
        cancelarEdicion: function () {
            this.$emit('cancelarEdicion');
        },
    },
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    width: 400px;
    max-width: 90%;
}

.modal h2 {
    margin-top: 0;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

button {
    padding: 5px 10px;
    margin: 10px;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;

}

button[type='submit'] {
    background-color: #28a745;
}

button[type='button'] {
    background-color: #dc3545;
}
</style>