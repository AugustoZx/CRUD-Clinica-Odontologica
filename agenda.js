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

const updateMedic = (index, medic) => {
    const dbMedic = readMedic()
    dbMedic[index] = medic
    setLocalStorage(dbMedic)
}

const readMedic = () => getLocalStorage()

const createMedic = (medic) => {
    const dbMedic = getLocalStorage()
    dbMedic.push (medic)
    setLocalStorage(dbMedic)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Médico'
}

const saveMedic = () => {
    if (isValidFields()) {
        const medic = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            especialidade: document.getElementById('especialidade').value,
            cpf: document.getElementById('cpf').value
        }
        const index = document.getElementById('nome').dataset.index
        const response = alert(`O médico ${medic.nome} foi cadastrado com sucesso`)
        if (index == 'new') {
            createMedic(medic)
            updateTable()
            closeModal()
        } else {
            updateMedic(index, medic)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (medic, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${medic.nome}</td>
        <td>${medic.email}</td>
        <td>${medic.especialidade}</td>
        <td>${medic.cpf}</td>
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
    const dbMedic = readMedic()
    clearTable()
    dbMedic.forEach(createRow)
}

const fillFields = (medic) => {
    document.getElementById('nome').value = medic.nome
    document.getElementById('email').value = medic.email
    document.getElementById('especialidade').value = medic.especialidade
    document.getElementById('cpf').value = medic.cpf
    document.getElementById('nome').dataset.index = medic.index
}

const editMedic = (index) => {
    const medic = readMedic()[index]
    medic.index = index
    fillFields(medic)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${medic.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editMedic(index)
        } else {
            const medic = readMedic()[index]
            const response = confirm(`Deseja realmente excluir o médico ${medic.nome} ?`)
            if (response) {
                deleteMedic(index)
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
    .addEventListener('click', saveMedic)

document.querySelector('#tableMedic>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)