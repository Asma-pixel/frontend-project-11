export default ({ content, uiState }) => {
  const list = document.querySelector('.list-group');
  const modalTitle = document.querySelector('.modal-title');
  const modalDescription = document.querySelector('.modal-body');
  const modalBtn = document.querySelector('.full-article');

  const uiStateItem = uiState.find((item) => item.isOpen === true);
  if (uiStateItem) {
    const idPost = uiStateItem.id;
    const currentPost = content.posts.find((item) => item.id === idPost);
    modalTitle.innerHTML = currentPost.title;
    modalDescription.innerHTML = currentPost.description;
    modalBtn.href = currentPost.url;
  }
  const links = list.querySelectorAll('a');
  links.forEach((link) => {
    const currentId = link.dataset.id;
    const currentUiState = uiState.find((item) => item.id === currentId);
    if (currentUiState) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    }
  });
};
