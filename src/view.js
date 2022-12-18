import onChange from 'on-change';

const processRender = (elements) => {
  elements.input.disabled = true;
  elements.button.disabled = true;
};
const fillingRender = (elements) => {
  elements.input.disabled = false;
  elements.button.disabled = false;
};
const successRender = (elements, i18nInstance) => {
  elements.input.classList.remove('is-invalid');
  elements.input.value = '';
  elements.input.focus();
  elements.feedback.innerHTML = i18nInstance.t('success.linkAdded');
  elements.feedback.classList.add('text-success');
  elements.feedback.classList.remove('text-danger');
};

const errorsRender = (error, elements, i18nInstance) => {
  elements.input.classList.add('is-invalid');
  elements.feedback.textContent = i18nInstance.t(`errors.${error}`);
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
};

const formRender = ({ form }, elements, i18nInstance) => {
  switch (form.state) {
    case 'filling': fillingRender(elements); break;
    case 'proccessing': processRender(elements); break;
    case 'failedOnValidation': errorsRender(form.error, elements, i18nInstance); break;
    default: throw new Error(`Нету такого процесса - ${form.state}`);
  }
};
const statusRender = ({ contentLoad }, elements, i18nInstance) => {
  switch (contentLoad.state) {
    case 'idle': break;
    case 'success': successRender(elements, i18nInstance); break;
    case 'failedOnLoad': errorsRender(contentLoad.error, elements, i18nInstance); break;
    default: throw new Error(`Нету такого процесса - ${contentLoad.state}`);
  }
};

const feedRender = ({ content }, elements) => {
  const { feeds } = content;
  const localElements = elements;
  const card = document.createElement('div');
  const divFeed = document.createElement('div');
  localElements.feeds.innerHTML = '';
  card.classList.add('card');
  card.classList.add('border-0');
  divFeed.classList.add('card-body');
  divFeed.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
  card.append(divFeed);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((element) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = element.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = element.description;
    li.append(h3);
    li.append(p);
    ul.append(li);
  });
  divFeed.append(ul);
  localElements.feeds.append(card);
};

const postRender = ({ content, uiState }, elements) => {
  const localElements = elements;
  localElements.posts.innerHTML = '';
  const postContainer = document.createElement('div');
  postContainer.classList.add('card', 'border-0');
  const postTitle = document.createElement('div');
  postTitle.classList.add('card-body');
  postTitle.innerHTML = '<h2 class="card-title h4">Посты</h2>';
  postContainer.append(postTitle);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  content.posts.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.dataset.id = item.id;
    a.href = item.url;
    a.textContent = item.title;
    a.classList.add('fw-bold');
    li.append(a);
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'btn-watcher');
    button.dataset.id = item.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = 'Просмотр';
    li.append(button);
    list.append(li);
  });
  postContainer.append(list);
  localElements.posts.append(postContainer);
  const modalTitle = document.querySelector('.modal-title');
  const modalDescription = document.querySelector('.modal-body');
  const modalBtn = document.querySelector('.full-article');

  const postId = uiState.modalPostId;
  if (postId !== null) {
    const currentPost = content.posts.find((item) => item.id === postId);
    modalTitle.textContent = currentPost.title;
    modalDescription.textContent = currentPost.description;
    modalBtn.href = currentPost.url;
  }
  const links = list.querySelectorAll('a');
  links.forEach((link) => {
    const currentId = link.dataset.id;
    const currentUiState = uiState.seenPosts.find((item) => item === currentId);
    if (currentUiState) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    }
  });
};

export default (state, elements, i18nInstance) => onChange(state, (path) => {
  switch (path) {
    case 'uiState.seenPosts': postRender(state, elements); break;

    case 'form.state': formRender(state, elements, i18nInstance); break;
    case 'contentLoad.state': statusRender(state, elements, i18nInstance); break;
    case 'content.posts': postRender(state, elements); break;
    case 'content.feeds': feedRender(state, elements); break;
    default: break;
  }
});
