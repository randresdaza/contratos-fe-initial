<template>
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h2>Nuevo Contrato</h2>
        <form @submit.prevent="submitForm">
          <div class="form-columns">
            <div class="form-column">
              <div class="form-group">
                <label for="contractNumber">Número de Contrato:</label>
                <input type="text" id="contractNumber" v-model="contractNumber" readonly>
              </div>
              <div class="form-group">
                <label for="asunto">Asunto:</label>
                <input type="text" id="asunto" v-model="asunto" required>
              </div>
              <div class="form-group">
                <label for="fecha_inicial">Fecha Inicial:</label>
                <input type="date" id="fecha_inicial" v-model="fechaInicial" required>
              </div>
              <div class="form-group">
                <label for="estante">Estante:</label>
                <input type="text" id="estante" v-model="estante" required>
              </div>
              <div class="form-group">
                <label for="caja">Caja:</label>
                <input type="text" id="caja" v-model="caja" required>
              </div>
              <div class="form-group">
                <label for="archivo">Archivo:</label>
                <input type="file" id="archivo" ref="archivo" @change="seleccionarArchivo">
                <label for="archivo">{{ nombreArchivo }}</label>
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label for="fecha_final">Fecha Final:</label>
                <input type="date" id="fecha_final" v-model="fechaFinal" required>
              </div>
              <div class="form-group">
                <label for="bandeja">Bandeja:</label>
                <input type="text" id="bandeja" v-model="bandeja" required>
              </div>
              <div class="form-group">
                <label for="numero_orden">Número de Orden:</label>
                <input type="text" id="numero_orden" v-model="numeroOrden" required>
              </div>
              <div class="form-group">
                <label for="numero_folios">Número de Folios:</label>
                <input type="number" id="numero_folios" v-model="numeroFolios" required>
              </div>
              <div class="form-group">
                <label for="observaciones">Observaciones:</label>
                <textarea id="observaciones" v-model="observaciones" required></textarea>
              </div>
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" @click="cancelar">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        contractNumber: '',
        asunto: '',
        fechaInicial: '',
        fechaFinal: '',
        estante: '',
        bandeja: '',
        caja: '',
        numeroOrden: '',
        numeroFolios: '',
        observaciones: '',
        archivo: null,
        nombreArchivo: '',
      };
    },
    methods: {
      submitForm() {
        // Lógica para guardar el formulario
      },
      cancelar() {
        this.$emit('cancelar-registro');
      },
      seleccionarArchivo(event) {
        this.archivo = event.target.files[0];
        this.nombreArchivo = this.archivo.name;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos del modal */
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
    width: 700px;
    max-width: 90%;
  }
  
  .modal h2 {
    margin-top: 0;
  }
  
  .form-columns {
    display: flex;
    justify-content: space-between;
  }
  
  .form-column {
    flex-basis: 48%;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .form-group input,
  .form-group textarea {
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
  