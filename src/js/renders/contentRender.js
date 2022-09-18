export default (content, elements, i18nInstance) => {
  const localElements = elements;
  localElements.input.disabled = false;
  localElements.button.disabled = false;
  localElements.input.classList.remove('is-invalid');
  localElements.input.value = '';
  localElements.input.focus();
  localElements.feedback.innerHTML = i18nInstance.t('success.linkAdded');
  localElements.feedback.classList.add('text-success');
  localElements.feedback.classList.remove('text-danger');
  console.log(content);

  localElements.feeds.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('border-0');
  localElements.feeds.append(card);
  const divFeed = document.createElement('div');
  divFeed.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
  card.append(divFeed);
  const ul = document.createElement('ul');
  console.log(content.feed);
  content.feed.flat().forEach((element) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = `<h3 class="h6 m-0">${element.title}</h3>`;
    const p = `<p class="m-0 small text-black-50">${element.description}</p>`;
    li.innerHTML = `${h3}\n${p}`.trim();
    ul.append(li);
  });
  card.append(ul);

  localElements.posts.innerHTML = '';
  const postContainer = document.createElement('ul');
  const postFlat = content.post.flat();
  postFlat.forEach((item) => {
    const li = document.createElement('li');
    const a = `<a href="${item.link}">${item.title}</a>`;
    li.innerHTML = a;
    postContainer.append(li);
  });
  localElements.posts.append(postContainer);
};
