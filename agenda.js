'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_agenda')) ?? []
const setLocalStorage = (dbAgenda) => localStorage.setItem("db_agenda", JSON.stringify(dbAgenda))

// CRUD - create read update delete
const deleteAgenda = (index) => {
    const dbAgenda = readAgenda()
    dbAgenda.splice(index, 1)
    setLocalStorage(dbAgenda)
}

const updateAgenda = (index, agenda) => {
    const dbAgenda = readAgenda()
    dbAgenda[index] = agenda
    setLocalStorage(dbAgenda)
}

const readAgenda = () => getLocalStorage()

const createAgenda = (agenda) => {
    const dbAgenda = getLocalStorage()
    dbAgenda.push (agenda)
    setLocalStorage(dbAgenda)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Nova Consulta'
}

const saveAgenda = () => {
    if (isValidFields()) {
        const agenda = {
            nome: document.getElementById('nome').value,
            genero: document.getElementById('genero').value,
            medico: document.getElementById('medico').value,
            data: document.getElementById('data').value
        }
        const index = document.getElementById('nome').dataset.index
        const response = alert(`A consulta de ${agenda.nome} foi marcada com sucesso`)
        if (index == 'new') {
            createAgenda(agenda)
            updateTable()
            closeModal()
        } else {
            updateAgenda(index, agenda)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (agenda, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${agenda.nome}</td>
        <td>${agenda.genero}</td>
        <td>${agenda.medico}</td>
        <td>${agenda.data}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableMedic>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableMedic>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbMedic = readAgenda()
    clearTable()
    dbMedic.forEach(createRow)
}

const fillFields = (agenda) => {
    document.getElementById('nome').value = agenda.nome
    document.getElementById('genero').value = agenda.genero
    document.getElementById('medico').value = agenda.medico
    document.getElementById('data').value = agenda.data
    document.getElementById('nome').dataset.index = agenda.index
}

const editMedic = (index) => {
    const agenda = readAgenda()[index]
    agenda.index = index
    fillFields(agenda)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${agenda.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editMedic(index)
        } else {
            const agenda = readAgenda()[index]
            const response = confirm(`Deseja realmente excluir a consulta de ${agenda.nome} ?`)
            if (response) {
                deleteAgenda(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('agenda')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveAgenda)

document.querySelector('#tableMedic>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)