import onChange from 'on-change';
import postRender from './postRender.js';
import feedRender from './feedRender.js';
import formRender from './formRender.js';
import uiStateRender from './uiStateRender.js';
import errorsRender from './errorsRender.js';

export default (state, elements, i18nInstance) => onChange(state, (path) => {
  switch (path) {
    case 'uiState': uiStateRender(state); break;
    case 'errors': errorsRender(state.errors, elements, i18nInstance); break;
    case 'formState': formRender(state, elements, i18nInstance); break;
    case 'content.posts': postRender(state, elements); break;
    case 'content.feeds': feedRender(state, elements); break;
    default: throw new Error(`Нету такого процесса - ${path}`);
  }
});
