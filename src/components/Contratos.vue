<template>
    <div class="information">
        <h1 style="font-size: 1.5em;">Contratos</h1>
        <div>
            <input v-model="busqueda" type="text" class="buscar-input" placeholder="Buscar">
            <button @click="mostrarRegistro = true" class="registrar-btn">Nuevo</button>
        </div>
        <div class="table-container">
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre del Archivo</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Usuario</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contrato in contratosFiltrados" :key="contrato.id">
                        <td>{{ contrato.id }}</td>
                        <td>{{ contrato.nombreArchivo }}</td>
                        <td>{{ contrato.fecha }}</td>
                        <td>{{ contrato.usuario }}</td>
                        <td>
                            <button @click="verContrato(contrato)" class="ver-btn">Ver</button>
                            <button @click="eliminarContrato(contrato.id)" class="eliminar-btn">Eliminar</button>
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
                <span v-if="busqueda === ''">Total registros: {{ 0 }}</span>
                <span v-else>Total registros: {{ contratosFiltrados.length }}</span>
            </div>
        </div>
        <ver-contrato-modal v-if="mostrarRegistro" :show-modal="mostrarRegistro" @registrar-contrato="registrarContrato"
            @cancelar-registro="cancelarRegistro"></ver-contrato-modal>
    </div>
</template>
  
<script>
import axios from 'axios';
import VerContratoModal from './VerContratoModal.vue';

export default {
    name: 'Contratos',
    components: {
        VerContratoModal,
    },
    data() {
        return {
            contratos: [],
            contratosFiltrados: [],
            busqueda: '',
            registrosPorPagina: 5,
            opcionesPagina: [5, 10, 25],
            contratoSeleccionado: null,
            showModal: false,
            mostrarRegistro: false,
        };
    },
    mounted() {
        this.getData();
    },
    computed: {
        totalRegistros() {
            return this.contratos.length;
        },
    },
    methods: {
        cambiarRegistrosPorPagina(opcion) {
            this.registrosPorPagina = opcion;
        },
        getData() {
            axios
                .get('')
                .then((response) => {
                    this.contratos = response.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        verContrato(contrato) {
            this.contratoSeleccionado = contrato;
            this.showModal = true;
        },
        cancelarRegistro() {
            this.mostrarRegistro = false;
        },
        eliminarContrato(contratoId) {
            axios
                .delete(`http://localhost:8000/contratos/${contratoId}`)
                .then((response) => {
                    this.getData();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('archivo', file);

            axios
                .post('http://localhost:8000/contratos/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    this.getData();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
    watch: {
        busqueda(nuevoValor) {
            this.contratosFiltrados = this.contratos.filter((contrato) => {
                return contrato.nombreArchivo.toLowerCase().includes(nuevoValor.toLowerCase());
            });
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 1.5em;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.label {
    font-weight: bold;
    margin-bottom: 5px;
}

.input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.button:hover {
    background-color: #45a049;
}

.table {
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table th {
    background-color: #4caf50;
    color: white;
}

.table tr:hover {
    background-color: #f5f5f5;
}

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button.active {
    background-color: #45a049;
}

.pagination button:hover {
    background-color: #45a049;
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

.eliminar-btn {
    padding: 5px 10px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.eliminar-btn:hover {
    background-color: #e53935;
}

.alert {
    padding: 10px;
    background-color: #f44336;
    color: white;
    text-align: center;
    margin-bottom: 20px;
}

.alert.success {
    background-color: #4caf50;
}

.alert.warning {
    background-color: #ff9800;
}

.alert.info {
    background-color: #2196f3;
}

.alert.error {
    background-color: #f44336;
}

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
    background-color: #555b60;
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


