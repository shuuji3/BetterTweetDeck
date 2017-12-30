import * as secureDomify from '../secureDomify';

export default function ($) {
  return {
    name: 'Open Graph',
    setting: 'ogp_me',
    re: /.+/,
    default: true,
    callback: (url) => {
      return fetch($.getSafeURL(url))
        .then($.statusAndText)
        .then((html) => {
          const doc = secureDomify.parse(html);
          const imgUrl =
            secureDomify.getAttributeFromNode(
              'meta[property="twitter:image"]',
              doc,
              'content',
            ) ||
            secureDomify.getAttributeFromNode(
              'meta[property="og:image"]',
              doc,
              'content',
            );
          if (imgUrl === null) return undefined;
          return {
            type: 'image',
            thumbnail_url: $.getSafeURL(imgUrl),
            url: $.getSafeURL(imgUrl),
          };
        });
    },
  };
}
