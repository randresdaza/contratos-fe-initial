<template>
    <div class="imagen">
        <img src="../assets/logo_alcaldia.png" alt="Logo Alcaldía" width="500" height="250">
    </div>
</template>

<script>
export default {
    name: "Home",
    data: function () {
        return {

        }
    }
}
</script>

<style>
.greetings {
    top: 0;
    right: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    display: flex;
    justify-content: center;
    padding: 10px 10px;
}

.imagen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.greetings h1 {
    font-size: 20px;
    color: #ffffff;
}

.greetings span {
    color: crimson;
    font-size: 20px;
}
</style>