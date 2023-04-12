export const showError = (input, message) => {
  const formItem = input.parentElement;
  formItem.classList.add("error");
  const error = formItem.querySelector(".form__field-error");
  error.textContent = message;
};

export const hideError = (input) => {
  const formItem = input.parentElement;
  formItem.classList.remove("error");
  const error = formItem.querySelector(".form__field-error");
  error.textContent = "";
};

export const isBetween = (value, min, max) =>
  !(value.length < min || value.length > max);

export const checkEmail = (email, isRequired = true) => {
  const isEmailValid = (value) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  };

  let isValid = false;

  const emailValue = email.value.trim() || "";

  if (isRequired && emailValue.length === 0) {
    showError(email, "Email is a required field.");
  } else if (!isEmailValid(emailValue)) {
    showError(email, "Email is not valid.");
  } else {
    isValid = true;
    hideError(email);
  }

  return isValid;
};

export const checkUserName = (
  userName,
  isRequired = true,
  min = 4,
  max = 8
) => {
  let isValid = false;
  const userNameValue = userName.value.trim() || "";
  if (isRequired && userNameValue.length === 0) {
    showError(userName, "User Name is a required field.");
  } else if (!isBetween(userNameValue, min, max)) {
    showError(
      userName,
      `Username must be between ${min} and ${max} characters.`
    );
  } else {
    isValid = true;
    hideError(userName);
  }
  return isValid;
};
