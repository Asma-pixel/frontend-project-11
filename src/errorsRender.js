export default (error, elements, i18nInstance) => {
  elements.input.disabled = false;
  elements.button.disabled = false;
  elements.input.classList.add('is-invalid');
  elements.feedback.innerHTML = i18nInstance.t(`errors.${error}`);
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
};
