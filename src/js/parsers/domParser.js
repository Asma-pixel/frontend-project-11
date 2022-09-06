import _ from "lodash";
export default (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  const errorNode = doc.querySelector('parsererror');
  if(errorNode) return Promise.reject({errors: 'Ошибка парсинга'});

  const feed = {
    id: _.uniqueId(),
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
  }
  const currentId = feed.id;
  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map(item => {
    return {
      feedId: currentId,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').nextSibling.textContent,
    }
  });
  return {feed, posts}
};

// <channel>
//     <title>Новые уроки на Хекслете</title>
//     <description>Практические уроки по программированию</description>
//     <link>https://ru.hexlet.io/
//     <webmaster>info@hexlet.io</webmaster>
//     <item>
//       <title>Введение / Комбинаторика</title>
//       <guid ispermalink="false">2892</guid>
//       <link>https://ru.hexlet.io/courses/combinatorics/lessons/intro/theory_unit
//       <description>Цель: Знакомимся с темой курса</description>
//       <pubdate>Mon, 05 Sep 2022 09:30:43 +0000</pubdate>
//     </item>
//     <item>
//       <title>Заключение / Трудоустройство</title>
//       <guid ispermalink="false">2937</guid>
//       <link>https://ru.hexlet.io/courses/employment/lessons/outro/theory_unit
//       <description>Цель: Подвести итоги курса</description>
//       <pubdate>Mon, 05 Sep 2022 05:35:53 +0000</pubdate>
//     </item>
//     <item>
//       <title>Вступление / Как писать классные тексты</title>
//       <guid ispermalink="false">2923</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/intro/theory_unit
//       <description>Цель: Поговорим о том, что такое редактура и зачем она нужна</description>
//       <pubdate>Fri, 02 Sep 2022 09:13:09 +0000</pubdate>
//     </item>
//     <item>
//       <title>Заключение / Как писать классные тексты</title>
//       <guid ispermalink="false">2874</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/outro/theory_unit
//       <description>Цель: Подводим итоги курса</description>
//       <pubdate>Fri, 02 Sep 2022 07:04:43 +0000</pubdate>
//     </item>
//     <item>
//       <title>Отслеживайте неясные формулировки / Как писать классные тексты</title>
//       <guid ispermalink="false">2926</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/dangerous-words/theory_unit
//       <description>Цель: Учимся убирать из текста скрытые действия и запутанные мысли</description>
//       <pubdate>Tue, 30 Aug 2022 13:51:00 +0000</pubdate>
//     </item>
//     <item>
//       <title>Пишите заключения / Как писать классные тексты</title>
//       <guid ispermalink="false">2925</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/writing-outro/theory_unit
//       <description>Цель: Учимся заканчивать урок</description>
//       <pubdate>Tue, 30 Aug 2022 07:23:30 +0000</pubdate>
//     </item>
//     <item>
//       <title>Функции и их вызов / Основы языка JavaScript</title>
//       <guid ispermalink="false">2927</guid>
//       <link>https://ru.hexlet.io/courses/js-basics/lessons/calling-functions/theory_unit
//       <description>Цель: Научиться использовать готовые функции</description>
//       <pubdate>Mon, 29 Aug 2022 09:28:56 +0000</pubdate>
//     </item>
//     <item>
//       <title>Оформляйте код / Как писать классные тексты</title>
//       <guid ispermalink="false">2872</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/style-of-code/theory_unit
//       <description>Цель: Вносим последние штрихи —&nbsp;оформляем фрагменты кода</description>
//       <pubdate>Fri, 26 Aug 2022 10:10:08 +0000</pubdate>
//     </item>
//     <item>
//       <title>Редактируйте текст / Как писать классные тексты</title>
//       <guid ispermalink="false">2870</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/style-of-writing/theory_unit
//       <description>Цель: Дорабатываем уроки на уровень предложений и отдельных формулировок</description>
//       <pubdate>Fri, 26 Aug 2022 10:09:45 +0000</pubdate>
//     </item>
//     <item>
//       <title>Пишите вступления / Как писать классные тексты</title>
//       <guid ispermalink="false">2924</guid>
//       <link>https://ru.hexlet.io/courses/awesome-text/lessons/writing-intro/theory_unit
//       <description>Цель: Учимся начинать урок</description>
//       <pubdate>Fri, 26 Aug 2022 10:09:27 +0000</pubdate>
//     </item>
//   </channel>