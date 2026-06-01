import { createCardElement, deleteCardElement, likeCard } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  updateUserAvatar,
  addNewCard,
  deleteCardOnServer,
  changeLikeCardStatus,
} from "./components/api.js";

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const placesWrap = document.querySelector(".places__list");

const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description"
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalLikesTitle = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalUserList = cardInfoModalWindow.querySelector(".popup__list");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

let currentUserId = null;

const setButtonLoading = (button, isLoading, defaultText, loadingText) => {
  button.textContent = isLoading ? loadingText : defaultText;
};

const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const createInfoItem = (term, description) => {
  const template = document.getElementById("popup-info-definition-template");
  const infoItem = template.content.cloneNode(true);

  infoItem.querySelector(".popup__info-term").textContent = term;
  infoItem.querySelector(".popup__info-description").textContent = description;

  return infoItem;
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;

  openModalWindow(imageModalWindow);
};

const handleInfoClick = (cardData) => {
  getCardList()
    .then((cards) => {
      const freshCardData =
        cards.find((item) => item._id === cardData._id) || cardData;

      cardInfoModalInfoList.textContent = "";
      cardInfoModalUserList.textContent = "";

      cardInfoModalInfoList.append(
        createInfoItem("Описание:", freshCardData.name)
      );

      cardInfoModalInfoList.append(
        createInfoItem(
          "Дата создания:",
          formatDate(new Date(freshCardData.createdAt))
        )
      );

      cardInfoModalInfoList.append(
        createInfoItem("Владелец:", freshCardData.owner.name)
      );

      cardInfoModalInfoList.append(
        createInfoItem(
          "Количество лайков:",
          freshCardData.likes.length
        )
      );

      if (freshCardData.likes.length) {
        cardInfoModalLikesTitle.textContent = "Лайкнули:";

        freshCardData.likes.forEach((user) => {
          const template = document.getElementById(
            "popup-info-user-preview-template"
          );

          const userItem = template.content.cloneNode(true);

          userItem.querySelector(".popup__list-item").textContent = user.name;

          cardInfoModalUserList.append(userItem);
        });
      } else {
        cardInfoModalLikesTitle.textContent = "";
      }

      openModalWindow(cardInfoModalWindow);
    })
    .catch(() => {});
};

const handleDeleteCard = (cardElement, cardId) => {
  deleteCardOnServer(cardId)
    .then(() => {
      deleteCardElement(cardElement);
    })
    .catch(() => {});
};

const renderCard = (data, method = "append") => {
  const cardElement = createCardElement(data, currentUserId, {
    onPreviewPicture: handlePreviewPicture,
    onLikeCard: (...args) => likeCard(...args, changeLikeCardStatus),
    onDeleteCard: handleDeleteCard,
    onInfoClick: handleInfoClick,
  });

  placesWrap[method](cardElement);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = profileForm.querySelector(".popup__button");

  setButtonLoading(
    submitButton,
    true,
    "Сохранить",
    "Сохранение..."
  );

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      closeModalWindow(profileFormModalWindow);
    })
    .catch(() => {})
    .finally(() => {
      setButtonLoading(
        submitButton,
        false,
        "Сохранить",
        "Сохранение..."
      );
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector(".popup__button");

  setButtonLoading(
    submitButton,
    true,
    "Сохранить",
    "Сохранение..."
  );

  updateUserAvatar({ avatar: avatarInput.value })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

      closeModalWindow(avatarFormModalWindow);
    })
    .catch(() => {})
    .finally(() => {
      setButtonLoading(
        submitButton,
        false,
        "Сохранить",
        "Сохранение..."
      );
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = cardForm.querySelector(".popup__button");

  setButtonLoading(
    submitButton,
    true,
    "Создать",
    "Создание..."
  );

  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCard) => {
      renderCard(newCard, "prepend");

      closeModalWindow(cardFormModalWindow);
    })
    .catch(() => {})
    .finally(() => {
      setButtonLoading(
        submitButton,
        false,
        "Создать",
        "Создание..."
      );
    });
};

profileForm.addEventListener("submit", handleProfileFormSubmit);

cardForm.addEventListener("submit", handleCardFormSubmit);

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;

  clearValidation(profileForm, validationSettings);

  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();

  clearValidation(avatarForm, validationSettings);

  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();

  clearValidation(cardForm, validationSettings);

  openModalWindow(cardFormModalWindow);
});

const allPopups = document.querySelectorAll(".popup");

allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;

    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((card) => {
      renderCard(card);
    });
  })
  .catch(() => {});