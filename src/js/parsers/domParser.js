import _ from 'lodash';

export default (str, i18nextInstance, currentId) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  const rss = doc.querySelector('rss');
  if (errorNode) throw new Error(i18nextInstance.t('errors.parseError'));
  if (rss === null) throw new Error(i18nextInstance.t('errors.linkNotRss'));
  const regexPattern = /^<!\[CDATA\[+|]]>$/g;
  const feed = {
    id: currentId,
    title: doc.querySelector('title').innerHTML.replace(regexPattern, ''),
    description: doc.querySelector('description').innerHTML.replace(regexPattern, ''),
  };
  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((item, index) => ({
    feedId: currentId,
    id: index + 1,
    title: item.querySelector('title').innerHTML.replace(regexPattern, ''),
    description: item.querySelector('description').innerHTML.replace(regexPattern, ''),
    link: item.querySelector('link').innerHTML,
  }));
  return { feed, posts };
};
