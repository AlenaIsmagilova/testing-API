const baseUrl = "https://polar-dusk-81472.herokuapp.com/notes";
const notesList = document.querySelector(".item__list");
const note = document.querySelector("#note").content;
const addNoteButton = document.querySelector(".form__button");
const noteTitleInput = document.querySelector("#inputTitle");
const noteTextInput = document.querySelector("#inputText");
const form = document.querySelector(".form");
const editNoteButton = document.querySelector(".button__edit");
const deleteNoteButton = document.querySelector(".button__delete");
const addNewNoteButton = document.querySelector(".form-add__button-add");
const inputTitleAddNewNote = document.querySelector("#inputTitleAddNewNote");
const inputTextAddNewNote = document.querySelector("#inputTextAddNewNote");

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Error: ${res.status}`);
  }
}

const getNotes = () => {
  return fetch(baseUrl, {
    method: "GET",
  }).then(checkResponse);
};

const deleteNote = (noteId) => {
  return fetch(`${baseUrl}/${noteId}`, {
    method: "DELETE",
  }).then(checkResponse);
};

const addNewNote = (noteAttribute) => {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: noteAttribute.title,
      text: noteAttribute.text,
    }),
  }).then(checkResponse);
};

const editNote = (noteConfigs) => {
  return fetch(`${baseUrl}/${noteConfigs.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: noteConfigs.title, text: noteConfigs.text }),
  }).then(checkResponse);
};

getNotes().then((notes) => {
  notes.forEach(function (note) {
    const createdNote = createNote(note.title, note.text, note.id);
    notesList.append(createdNote);
  });
});

function createNote(title, text, noteId) {
  const noteElement = note.querySelector(".item_note").cloneNode(true);
  const noteTitle = noteElement.querySelector(".item__title");
  const noteText = noteElement.querySelector(".item__text");
  const deleteButton = noteElement.querySelector(".button__delete");
  const editNoteButton = noteElement.querySelector(".button__edit");
  const deleteNoteButton = noteElement.querySelector(".button__delete");
  const noteEditTitleInput = noteElement.querySelector("#inputEditedTitle");
  const noteEditTextInput = noteElement.querySelector("#inputEditedText");
  const form = noteElement.querySelector(".form");
  const cancelButton = noteElement.querySelector(".button__cancel");
  const addNewNoteForm = document.querySelector(".form-add");
  noteTitle.textContent = title;
  noteText.textContent = text;
  deleteButton.addEventListener("click", function () {
    deleteNote(noteId).then(() => {
      noteElement.remove();
    });
  });
  //редактирование заметки, сохранение и отправка данных новой заметки
  form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    editNote({
      title: noteEditTitleInput.value,
      text: noteEditTextInput.value,
      id: noteId,
    }).then((updatedNote) => {
      noteTitle.textContent = updatedNote.title;
      noteText.textContent = updatedNote.text;
      noteEditTitleInput.value = "";
      noteEditTextInput.value = "";
      form.classList.remove("form_opened");
      editNoteButton.classList.remove("button__edit_inactive");
      deleteNoteButton.classList.remove("button__delete_inactive");
    });
  });

  //открытие формы
  editNoteButton.addEventListener("click", function () {
    editNoteButton.classList.add("button__edit_inactive");
    deleteNoteButton.classList.add("button__delete_inactive");
    form.classList.add("form_opened");
    noteEditTitleInput.value = noteTitle.textContent;
    noteEditTextInput.value = noteText.textContent;
  });
  //закрытие формы без сохранения изменений в заметке
  cancelButton.addEventListener("click", function () {
    noteEditTitleInput.value = noteTitle.textContent;
    noteEditTextInput.value = noteText.textContent;
    form.classList.remove("form_opened");
    editNoteButton.classList.remove("button__edit_inactive");
    deleteNoteButton.classList.remove("button__delete_inactive");
  });
  //добавление новой заметки
  function handleAddFormSubmit(evt) {
    evt.preventDefault();
    addNewNote({
      title: inputTitleAddNewNote.value,
      text: inputTextAddNewNote.value,
    }).then((data) => {
      const newNote = createNote(data.title, data.text, data.id);
      notesList.prepend(newNote);
      inputTitleAddNewNote.value = "";
      inputTextAddNewNote.value = "";
      addNewNoteForm.classList.remove("form_opened");
      addNewNoteButton.classList.remove("form-add__button-add_inactive");
    });
  }
  addNewNoteForm.addEventListener("submit", handleAddFormSubmit);
  //открытие формы добавления новой заметки
  addNewNoteButton.addEventListener("click", function () {
    addNewNoteForm.classList.add("form_opened");
    addNewNoteButton.classList.add("form-add__button-add_inactive");
  });
  return noteElement;
}
