const processRender = (elements) => {
  elements.input.disabled = true;
  elements.button.disabled = true;
};
const successRender = (elements, i18nInstance) => {
  elements.input.disabled = false;
  elements.button.disabled = false;
  elements.input.classList.remove('is-invalid');
  elements.input.value = '';
  elements.input.focus();
  elements.feedback.innerHTML = i18nInstance.t('success.linkAdded');
  elements.feedback.classList.add('text-success');
  elements.feedback.classList.remove('text-danger');
};

export default (state, elements, i18nInstance) => {
  switch (state.formState) {
    case 'initial': return;
    case 'success': successRender(elements, i18nInstance); break;
    case 'proccessing': processRender(elements); break;
    default: throw new Error(`Нету такого процесса - ${state.formState}`);
  }
};
