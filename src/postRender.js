import uiStateRender from './uiStateRender.js';

export default ({ content, uiState }, elements) => {
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
    const a = `<a data-id=${item.id} class="fw-bold"href="${item.url}">${item.title}</a>`;
    li.innerHTML = a;
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
  uiStateRender({ content, uiState });
};
