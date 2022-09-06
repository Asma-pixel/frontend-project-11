export default (value, elements, i18nInstance) => {
  const localElements = elements;
  localElements.input.disabled = false;
  localElements.button.disabled = false;
  localElements.input.classList.add('is-invalid');
  localElements.feedback.innerHTML = value;
  localElements.feedback.classList.remove('text-success');
  localElements.feedback.classList.add('text-danger');
  console.log('afds')
};
