export default (content, elements) => {
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
  content.feed.forEach((element) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = `<h3 class="h6 m-0">${element.title}</h3>`;
    const p = `<p class="m-0 small text-black-50">${element.description}</p>`;
    li.innerHTML = `${h3}\n${p}`.trim();
    ul.append(li);
  });
  divFeed.append(ul);
  localElements.feeds.append(card);
};
