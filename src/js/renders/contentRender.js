export default (elements, i18nInstance) => {
  const localElements = elements;
  localElements.input.disabled = false;
  localElements.button.disabled = false;
  localElements.input.classList.remove('is-invalid');
  localElements.input.value = '';
  localElements.input.focus();
  localElements.feedback.innerHTML = i18nInstance.t('success.linkAdded');
  localElements.feedback.classList.add('text-success');
  localElements.feedback.classList.remove('text-danger');
  console.log('asdf');
};
