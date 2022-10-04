export default (content, elements) => {
  const localElements = elements;

  localElements.posts.innerHTML = '';
  const postContainer = document.createElement('ul');
  postContainer.classList.add('list-group', 'border-0', 'rounded-0');
  const postFlat = content.post.flat();

  postFlat.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = `<a data-id=${item.id} href="${item.link}">${item.title}</a>`;
    li.innerHTML = a;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'btn-watcher');
    button.dataset.id = item.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = 'Просмотр';
    li.append(button);
    postContainer.append(li);
  });
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
      modalBtn.href = currentPost.link;
      const currentUiStateItem = content.uiState.find((item) => item.id === currentId);
      currentUiStateItem.isClicked = true;
      const link = btn.previousSibling;
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    });
  });
  const links = postContainer.querySelectorAll('a');
  console.log(content.uiState);
  links.forEach((link) => {
    const currentId = link.dataset.id;
    const currentUiState = content.uiState.find((item) => item.id === currentId);
    if (currentUiState.isClicked) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    }
  });
};
