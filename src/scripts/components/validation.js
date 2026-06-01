const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  settings
) => {
  const errorElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );

  inputElement.classList.add(
    settings.inputErrorClass
  );

  errorElement.textContent = errorMessage;

  errorElement.classList.add(
    settings.errorClass
  );
};

const hideInputError = (
  formElement,
  inputElement,
  settings
) => {
  const errorElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );

  inputElement.classList.remove(
    settings.inputErrorClass
  );

  errorElement.textContent = "";

  errorElement.classList.remove(
    settings.errorClass
  );
};

const checkInputValidity = (
  formElement,
  inputElement,
  settings
) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(
      inputElement.dataset.errorMessage
    );
  } else {
    inputElement.setCustomValidity("");
  }

  if (inputElement.validity.valid) {
    hideInputError(
      formElement,
      inputElement,
      settings
    );
  } else {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableSubmitButton = (
  buttonElement,
  settings
) => {
  buttonElement.classList.add(
    settings.inactiveButtonClass
  );

  buttonElement.setAttribute(
    "disabled",
    true
  );
};

const enableSubmitButton = (
  buttonElement,
  settings
) => {
  buttonElement.classList.remove(
    settings.inactiveButtonClass
  );

  buttonElement.removeAttribute("disabled");
};

const toggleButtonState = (
  inputList,
  buttonElement,
  settings
) => {
  const hasError = hasInvalidInput(inputList);

  if (hasError) {
    disableSubmitButton(
      buttonElement,
      settings
    );
    return;
  }

  enableSubmitButton(
    buttonElement,
    settings
  );
};

const setEventListeners = (
  formElement,
  settings
) => {
  const inputList = Array.from(
    formElement.querySelectorAll(
      settings.inputSelector
    )
  );

  const buttonElement =
    formElement.querySelector(
      settings.submitButtonSelector
    );

  toggleButtonState(
    inputList,
    buttonElement,
    settings
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener(
      "input",
      () => {
        checkInputValidity(
          formElement,
          inputElement,
          settings
        );

        toggleButtonState(
          inputList,
          buttonElement,
          settings
        );
      }
    );
  });
};

export const clearValidation = (
  formElement,
  settings
) => {
  const inputList = Array.from(
    formElement.querySelectorAll(
      settings.inputSelector
    )
  );

  const buttonElement =
    formElement.querySelector(
      settings.submitButtonSelector
    );

  inputList.forEach((inputElement) => {
    hideInputError(
      formElement,
      inputElement,
      settings
    );

    inputElement.setCustomValidity("");
  });

  disableSubmitButton(
    buttonElement,
    settings
  );
};

export const enableValidation = (
  settings
) => {
  const formList = Array.from(
    document.querySelectorAll(
      settings.formSelector
    )
  );

  formList.forEach((formElement) => {
    setEventListeners(
      formElement,
      settings
    );
  });
};