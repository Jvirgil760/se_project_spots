import "./index.css";
import {
  enableValidation,
  validationConfig,
  resetValidation,
  disableButton,
} from "../scripts/validate.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";
import logoUrl from "../images/Logo.svg";
import bessieAvatarUrl from "../images/2-photo-by-ceiline-from-pexels.jpg";

let currentUserId = null;

const logoImg = document.querySelector(".header__logo");
if (logoImg) logoImg.src = logoUrl;

const avatarImg = document.querySelector(".profile__avatar");
if (avatarImg) avatarImg.src = bessieAvatarUrl;

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "39f62b95-67ac-4d7c-bf5a-ef1eec819efb",
    "Content-Type": "application/json",
  },
});

// Destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([user, cards]) => {
    currentUserId = user._id;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    if (avatarImg) avatarImg.src = user.avatar;

    // newest first (optional)
    cards.reverse().forEach((data) => {
      console.log(data);
      cardList.prepend(getCardElement(data));
    });
  })
  .catch(console.error);

// List of modals, for setting overlay click listeners.
const modals = document.querySelectorAll(".modal");

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardForm.querySelector("#profile-caption-input");
const cardLinkInput = cardForm.querySelector("#add-card-image-link-input");

// Avatar form element
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarForm.querySelector("#profile-avatar-input");

// Preview image popup elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");

let selectedCard = null;
let selectedCardId = null;

function onClosePress(evt) {
  if (evt.key === "Escape") {
    const currentModal = document.querySelector(".modal_opened");
    closeModal(currentModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", onClosePress);
  //addEscapeListener(modal);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", onClosePress);
  //removeEscapeListener(modal);
}

// define a function for changing the button text. It accepts 4 params (the 2 last are optional with default texts)
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true, "Save", "Saving…");

  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((serverCard) => {
      cardList.prepend(getCardElement(serverCard));
      cardForm.reset();
      closeModal(cardModal);

      // disable only after success
      disableButton(btn, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(btn, false, "Save");
    });
}

cardForm.addEventListener("submit", handleAddCardSubmit);

// TODO - implement loading text for all other form submissions

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true, "Save", "Saving…");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((user) => {
      profileName.textContent = user.name; // <-- use server data
      profileDescription.textContent = user.about; // <-- use server data
      closeModal(editModal);

      // disable only after success, so the form starts disabled next time
      disableButton(btn, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(btn, false, "Save");
    });
}

editFormElement.addEventListener("submit", handleAddingCardSubmit);

function handleAddingCardSubmit(evt) {
  evt.preventDefault();
  const btn = evt.submitter;

  setButtonText(btn, true, "Save", "Saving…");

  api
    .addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((serverCard) => {
      // IMPORTANT: use the server response so getCardElement sees serverCard.isLiked
      cardList.prepend(getCardElement(serverCard));

      cardForm.reset();
      closeModal(cardModal);
      disableButton(btn, validationConfig); // disable only after success
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(btn, false, "Save");
    });
}

cardForm.addEventListener("submit", handleAddCardSubmit);

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const deleteButton = evt.submitter;
  setButtonText(deleteButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      deleteForm.reset();
      closeModal(deleteModal);

      // disable after success
      disableButton(deleteButton, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteButton, false, "Delete");
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

function handleLike(evt, id) {
  const btn = evt.target;
  const wasLiked = btn.classList.contains("card__like-button_liked");

  api
    .changeLikeStatus(id, wasLiked)
    .then((updatedCard) => {
      // server is the source of truth
      btn.classList.toggle("card__like-button_liked", !!updatedCard.isLiked);
      // If you show a counter, update it here from updatedCard
      // likeCounter.textContent = updatedCard.likesCount ?? '';
    })
    .catch(console.error);
}

function handleImageClick(data) {
  previewModalImgEl.src = data.link;
  previewModalImgEl.alt = data.name;
  previewModalCaptionEl.textContent = data.name;
  openModal(previewModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEL = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-icon");

  // TODO - if the card is liked, set the active class on the card
  //
  cardTitleEL.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  // set initial like state from server data
  cardLikeBtn.classList.toggle("card__like-button_liked", !!data.isLiked);

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  deleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    validationConfig
  );
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});
cardForm.addEventListener("submit", handleAddCardSubmit);

// Avatar modal open & close handlers
avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

//submit handler for avatar modal
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  disableButton(btn, validationConfig);

  api
    .editAvatar({ avatar: avatarInput.value })
    .then((user) => {
      avatarImg.src = user.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      btn.disabled = false;
      btn.classList.remove(validationConfig.inactiveButtonClass);
    });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    const clickBackdrop =
      e.target.classList.contains("modal") &&
      !e.target.closest(".modal__container");
    const clickX = e.target.classList.contains("modal__close-btn");
    if (clickBackdrop || clickX) closeModal(modal);
  });
});

enableValidation(validationConfig);
