import onChange from 'on-change';

export default (state, elements) => {
  const localElements = elements;
  const a = onChange(state, (path, value) => {
    if (value.length === 0) {
      localElements.input.classList.remove('is-invalid');
      localElements.input.value = '';
      localElements.input.focus();
      localElements.feedback.innerHTML = 'Rss успешно загружен';
      localElements.feedback.classList.add('text-success');
      localElements.feedback.classList.remove('text-danger');
      return;
    }
    localElements.input.classList.add('is-invalid');
    localElements.feedback.innerHTML = value;
    localElements.feedback.classList.remove('text-success');
    localElements.feedback.classList.add('text-danger');
  });
  return a;
};
