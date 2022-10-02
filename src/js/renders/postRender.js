export default (content, elements, i18nInstance) => {
  const localElements = elements;
  console.log(content);
  localElements.feeds.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card');
  card.classList.add('border-0');
 
  const divFeed = document.createElement('div');
  divFeed.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
  card.append(divFeed);
  const ul = document.createElement('ul');
  content.feed.forEach((element) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = `<h3 class="h6 m-0">${element.title}</h3>`;
    const p = `<p class="m-0 small text-black-50">${element.description}</p>`;
    li.innerHTML = `${h3}\n${p}`.trim();
    ul.append(li);
  });
  card.append(ul);
  console.log(ul)
  localElements.feeds.append(card);
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
