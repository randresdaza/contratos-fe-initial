<template>
    <div class="signUp_user">
        <div class="container_signUp_user">
            <h2>Registrarse</h2>
            <form v-on:submit.prevent="processSignUp">
                <input type="text" v-model="user.username" placeholder="Username" class="form-control">
                <input type="password" v-model="user.password" placeholder="Contraseña" class="form-control">
                <input type="text" v-model="user.name" placeholder="Nombre" class="form-control">
                <input type="email" v-model="user.email" placeholder="Correo" class="form-control">
                <select v-model="user.rol" class="form-control">
                    <option value="">Seleccionar Rol</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Digitador">Digitador</option>
                </select>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
//import {request} from 'http';
export default {
    name: 'SignUp',
    data: function () {
        return {
            user: {
                username: "",
                password: "",
                name: "",
                email: "",
                rol: "",
            }
        }
    },
    methods: {
        processSignUp() {
            const headers = {
                'Content-Type': 'application/json',
            };
            axios.post(
                "http://127.0.0.1:8000/userCreate/",
                this.user,
                { headers }
            )
                .then((result) => {
                    let dataSignUp = {
                        token_access: result.data.access,
                        token_refresh: result.data.refresh,
                        username: this.user.username
                    };
                    this.$emit('completedSignUp', dataSignUp);
                })
                .catch((error) => {
                    console.log(error);
                    alert("Fallo en el registro del usuario");
                });
        }
    }
}
</script>

<style>
.signUp_user {
    margin: 0;
    padding: 0%;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container_signUp_user {
    border: 3px solid #283747;
    border-radius: 10px;
    width: 25%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.signUp_user h2 {
    color: #283747;
}

.signUp_user form {
    width: 70%;
}

.signUp_user input {
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    margin: 5px 0;
    border: 1px solid #283747;
}

.signUp_user button {
    width: 100%;
    height: 40px;
    color: #E5E7E9;
    background: #283747;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 10px 25px;
    margin: 5px 0 25px 0;
}

.signUp_user button:hover {
    color: #E5E7E9;
    background: crimson;
    border: 1px solid #283747;
}

.signUp_user input,
.signUp_user select {
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 20px;
    margin-bottom: 10px;
    border: 1px solid #283747;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.signUp_user button {
    width: 100%;
    height: 40px;
    color: #E5E7E9;
    background: #283747;
    border: 1px solid #E5E7E9;
    border-radius: 5px;
    padding: 5px 25px;
    margin-top: 10px;
}
</style>
