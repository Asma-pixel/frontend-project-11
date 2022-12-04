export default (error, elements, i18nInstance, status) => {
  const localElements = elements;
  localElements.input.disabled = false;
  localElements.button.disabled = false;
  if (status === 'failed') {
    localElements.input.classList.add('is-invalid');
    localElements.feedback.innerHTML = i18nInstance.t(`errors.${error}`);
    localElements.feedback.classList.remove('text-success');
    localElements.feedback.classList.add('text-danger');
    return;
  }
  localElements.input.classList.remove('is-invalid');
  localElements.input.value = '';
  localElements.input.focus();
  localElements.feedback.innerHTML = i18nInstance.t('success.linkAdded');
  localElements.feedback.classList.add('text-success');
  localElements.feedback.classList.remove('text-danger');
};
