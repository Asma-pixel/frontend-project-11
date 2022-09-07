import _ from 'lodash';

export default (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) throw new Error('Ошибка парсинга');

  const feed = {
    id: _.uniqueId(),
    title: doc.querySelector('title').innerHTML,
    description: doc.querySelector('description').innerHTML,
  };
  const currentId = feed.id;
  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((item) => ({
    feedId: currentId,
    title: item.querySelector('title').innerHTML,
    description: item.querySelector('description').innerHTML,
    link: item.querySelector('link').nextSibling.innerHTML,
  }));
  return { feed, posts };
};
