export default (str, i18nextInstance, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) throw new Error('linkNotRss');

  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    link: url,
  };
  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  return { feed, posts };
};
