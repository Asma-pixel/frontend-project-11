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
  content.post.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = `<a data-id=${item.id} href="${item.url}">${item.title}</a>`;
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

  const btns = document.querySelectorAll('.btn-watcher');
  const modalTitle = document.querySelector('.modal-title');
  const modalDescription = document.querySelector('.modal-body');
  const modalBtn = document.querySelector('.full-article');
  btns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const currentId = e.target.dataset.id;
      const currentPost = content.post.find((item) => item.id === currentId);
      modalTitle.innerHTML = currentPost.title;
      modalDescription.innerHTML = currentPost.description;
      modalBtn.href = currentPost.url;
      const currentUiStateItem = uiState.find((item) => item.id === currentId);
      currentUiStateItem.isClicked = true;
      const link = btn.previousSibling;
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    });
  });
  const links = list.querySelectorAll('a');

  links.forEach((link) => {
    const currentId = link.dataset.id;
    const currentUiState = uiState.find((item) => item.id === currentId);
    if (currentUiState.isClicked) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    }
  });
};
