import onChange from 'on-change';

export default (state, elements, i18nInstance) => {
  const localElements = elements;
  return onChange(state, (path, value) => {
    if (value.length === 0) {
      localElements.input.classList.remove('is-invalid');
      localElements.input.value = '';
      localElements.input.focus();
      localElements.feedback.innerHTML = i18nInstance.t('success.linkAdded');
      localElements.feedback.classList.add('text-success');
      localElements.feedback.classList.remove('text-danger');
      return;
    }
    localElements.input.classList.add('is-invalid');
    localElements.feedback.innerHTML = value;
    localElements.feedback.classList.remove('text-success');
    localElements.feedback.classList.add('text-danger');
  });
};
