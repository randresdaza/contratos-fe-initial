<template>
    <div class="logIn_user">
        <div class="containter_logIn_user">
            <h2>Iniciar Sesión</h2>
            <form v-on:submit.prevent="processLogInUser">
                <input type="text" v-model="user.username" placeholder="Username">
                <br>
                <input type="password" v-model="user.password" placeholder="Contraseña">
                <br>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LogIn',
    data: function () {
        return {
            user: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        processLogInUser: function () {
            if (this.user.username === "" || this.user.password === "") {
                alert("Por favor ingresa el nombre de usuario y la contraseña");
                return;
            }
            axios.post(
                "http://127.0.0.1:8000/login/",
                this.user,
                { headers: {} }
            )
                .then((result) => {
                    let dataLogIn = {
                        token_access: result.data.access,
                        token_refresh: result.data.refresh,
                        username: this.user.username
                    }
                    this.$emit('completedLogIn', dataLogIn)
                })
                .catch((error) => {
                    if (error.response.status == "401")
                        alert("Las credenciales son incorrectas")
                });
        }
    }
}
</script>

<style>
.logIn_user {
    margin: 0;
    padding: 0%;
    height: 90%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container_logIn_user {
    border: 3px solid #283747;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.logIn_user h2 {
    color: #283747;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.logIn_user form {
    width: 70%;
}

.logIn_user input {
    height: 50px;
    width: 200px;
    box-sizing: border-box;
    padding: 10px 20px;
    margin: 5px 0;
    border: 1px solid #283747;
    border-radius: 5px;
}

.logIn_user button {
    width: 200px;
    height: 50px;
    color: #e5e7e9;
    background: #4d4e50;
    border: 1px solid #000000;
    border-radius: 5px;
    padding: 10px 25px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: bold;
}

.logIn_user button:hover {
    background: #000000;
    border-color: #000000;
}
</style>
