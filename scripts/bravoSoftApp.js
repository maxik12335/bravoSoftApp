const form = document.querySelector(".form")
const formSelect = document.querySelector(".select")
const formInput = document.querySelector(".input-doc")
const formModal = form.querySelector(".modal")
const modalBtn = document.querySelector(".modal__btn")
const modalText = document.querySelector(".modal__text")

// 1. Method add option to Select
renderOptionsUsers()

// 2. Method get docs and render table for time render index.html
getDocs("")

// 3. Method form Submit
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

    console.log("res Front: ", res)

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

// 4. Method jobs with modal window
modalBtn.addEventListener("click" , () => {
  hideModal()
})

function showModal(text) {
  console.log("MODAL text: ", text)
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

  console.log("users Frontend: ", users)
  console.log("users Frontend: ", typeof users)
  
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

  console.log("docs Frontend: ", docs)
  console.log("docs Frontend: ", typeof docs)

  let listDocs = []
  let listCheckDocs = []
  let filteredListDocs = []

  // listDocs: получить из Database list doc
  docs.forEach(docElement => {
    listDocs.push(docElement.doc)
  })

  // listCheckDocs: получить list для фильтрации (есть ли такой документ в массиве)
  // filteredListDocs: получить отфильтрованный list документов 0: [док 1, док 1, док 1], 1: [док 2, док 2]
  listDocs.forEach(item => {
      if(listCheckDocs.includes(item)) {
          return
      }
      
      // "Push Check: "
      listCheckDocs.push(listDocs.filter(el => el === item)[0])
      // "Push Filtered: "
      filteredListDocs.push(listDocs.filter(el => el === item))
  })

  console.log("filteredListDocs: ", filteredListDocs)
  console.log("listCheckDocs: ", listCheckDocs)

  // Получить кол-во заказанных документов
  let listDocsAndLength = []

  filteredListDocs.forEach((item, index) => {
      console.log(`Документ: ${item[0]} заказан ${item.length} раз`)
      listDocsAndLength.push([item[0], item.length])
  })

  console.log("listDocsAndLength: ", listDocsAndLength)

  // listDocsAndLength: Сортированный от большего к меньшему
  listDocsAndLength = listDocsAndLength.sort((a, b) => {
    return b[1] - a[1]
  })

  console.log("listDocsAndLength BIg -> little: ", listDocsAndLength)

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
      // Думаю, можно улучшить обновление списка *
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

