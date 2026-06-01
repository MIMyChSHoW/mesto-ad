export const likeCard = (
  likeButton,
  likeCount,
  cardId,
  cardData,
  changeLikeCardStatusFn
) => {
  const isLiked = likeButton.classList.contains(
    "card__like-button_is-active"
  );

  changeLikeCardStatusFn(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle(
        "card__like-button_is-active"
      );

      likeCount.textContent = updatedCard.likes.length;

      cardData.likes = [...updatedCard.likes];
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteCardElement = (cardElement) => {
  if (!cardElement) {
    return;
  }

  cardElement.remove();
};

const getTemplate = () => {
  const template = document.getElementById("card-template");

  const card = template.content
    .querySelector(".card")
    .cloneNode(true);

  return card;
};

export const createCardElement = (
  data,
  currentUserId,
  {
    onPreviewPicture,
    onLikeCard,
    onDeleteCard,
    onInfoClick,
  }
) => {
  const cardElement = getTemplate();

  const likeButton = cardElement.querySelector(
    ".card__like-button"
  );

  const likeCount = cardElement.querySelector(
    ".card__like-count"
  );

  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete"
  );

  const infoButton = cardElement.querySelector(
    ".card__control-button_type_info"
  );

  const cardImage =
    cardElement.querySelector(".card__image");

  const cardTitle =
    cardElement.querySelector(".card__title");

  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardTitle.textContent = data.name;

  likeCount.textContent = data.likes?.length ?? 0;

  const userLikedCard =
    data.likes?.some(
      (user) => user._id === currentUserId
    );

  if (userLikedCard) {
    likeButton.classList.add(
      "card__like-button_is-active"
    );
  }

  const isOwner =
    data.owner._id === currentUserId;

  if (isOwner) {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(cardElement, data._id);
    });
  } else {
    deleteButton.remove();
  }

  if (
    infoButton &&
    typeof onInfoClick === "function"
  ) {
    infoButton.addEventListener("click", () => {
      onInfoClick(data);
    });
  }

  likeButton.addEventListener("click", () => {
    onLikeCard(
      likeButton,
      likeCount,
      data._id,
      data
    );
  });

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => {
      onPreviewPicture({
        name: data.name,
        link: data.link,
      });
    });
  }

  return cardElement;
};