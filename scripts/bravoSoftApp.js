const form = document.querySelector(".form")
const formSelect = document.querySelector(".select")
const formInput = document.querySelector(".input-doc")
const formModal = form.querySelector(".modal")
const modalBtn = document.querySelector(".modal__btn")
const modalText = document.querySelector(".modal__text")

renderOptionsUsers()
getDocs("")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  if(formSelect.value !== "" && formInput.value !== "") {
    let res = await fetch("/save-form", {
      method: "POST",
      body: JSON.stringify({
        "select": formSelect.value,
        "inputDoc": formInput.value,
      })
    })
      .then(res => res.json())
      .then(res => res)

    formSelect.value = "";
    formInput.value = "";

    if(res.value) {
      getDocs("submit")
      showModal(res.text)
    } else {
      showModal(res.text)
    }
  } else {
    showModal("Заполните все поля")
  }


})

modalBtn.addEventListener("click" , () => {
  hideModal()
})

function showModal(text) {
  formModal.classList.add("modal-active")
  modalText.textContent = text
}

function hideModal() {
  formModal.classList.remove("modal-active")
}

async function renderOptionsUsers() {
  let users = await fetch("/get-users")
    .then(res => res.json())
    .then(res => res)
  
  users.forEach(user => {
    let optionElement = document.createElement("option")
    optionElement.value = user.name
    optionElement.textContent = user.name
    formSelect.append(optionElement)
  })
}

async function getDocs(check) {

  let docs = await fetch("/get-docs")
    .then(res => res.json())
    .then(res => res)

  let listDocs = []
  let listCheckDocs = []
  let filteredListDocs = []

  docs.forEach(docElement => {
    listDocs.push(docElement.doc)
  })

  listDocs.forEach(item => {
      if(listCheckDocs.includes(item)) {
          return
      }
      
      listCheckDocs.push(listDocs.filter(el => el === item)[0])
      filteredListDocs.push(listDocs.filter(el => el === item))
  })

  let listDocsAndLength = []

  filteredListDocs.forEach((item, index) => {
      listDocsAndLength.push([item[0], item.length])
  })

  listDocsAndLength = listDocsAndLength.sort((a, b) => {
    return b[1] - a[1]
  })

  if(listDocsAndLength.length !== 0) {
    createTable(listDocsAndLength, check)
  }

  function createTable(listDocs, check) {
  
    if(!document.querySelector(".table")) {
      let table = document.createElement("table")
      table.classList.add("table")

      document.querySelector(".box-table").append(table)
    }

    let tableContent = document.createElement('tbody')
    
    if(check === "") {  
      appendTable()
    } else if(check === "submit") {
      
      if(document.querySelector("tbody")) {
        document.querySelector("tbody").remove()
      }
      
      appendTable()     
    }

    function appendTable() {
      listDocs.forEach(item => {
        tableContent.innerHTML += `
          <tr class='row'>
            <td class='column'>${item[0]}</td>
            <td class='column'>${item[1]} шт.</td>
          </tr>
        `

        document.querySelector('.table').append(tableContent)
      })  
    }

  }
}

