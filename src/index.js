/* jshint scripturl:true */

import vImage from './vImage.vue';
//  Get Attributes
const ga = (el, col) => {
  const value = el.getAttribute(col);
  if (value !== null && value.length === 0) return true;
  return value;
};

const addImageAttributes = (el, binding, options) => {
  const defaultOptions = {
    'group': el.dataset.group || null,
    'download': false,
    'thumbnails': true,
    'openOn': 'click',
    'events': {},
    'cursor': 'pointer',
    'title': el.alt || el.title || null,
    'src': el.dataset.src || el.src,
  };
  let imgOptions = Object.assign(defaultOptions, options);

  // Overriding options if they're provided in binding.value
  if (typeof binding.value !== 'undefined') {
    imgOptions = Object.assign(imgOptions, binding.value);
    //  re-Set Title if global title not exists
    if (!binding.value.title) imgOptions.title = el.alt || el.title || null;
  }
  //  re-Set Title if input options title not exists
  if (!options.title) imgOptions.title = el.alt || el.title || null;
  //  re-Set Download button for every child image if its exists
  imgOptions.download = ga(el, 'data-download') ||
      imgOptions.download;

  // Setting up data attributes for dynamic properties
  el.setAttribute('data-src', imgOptions.src);

  if (imgOptions.group) el.setAttribute('data-group', imgOptions.group);
  if (imgOptions.title) el.setAttribute('data-title', imgOptions.title);
  if (imgOptions.download) {
    el.setAttribute('data-download', imgOptions.download);
  }
  if (imgOptions.thumbnails) {
    el.setAttribute('data-thumbnails', imgOptions.thumbnails);
  }

  // Applying options
  el.style.cursor = imgOptions.cursor;

  return imgOptions;
};

const install = (Vue, options) => {
  const Screen = Vue.extend(vImage);

  const defaultOptions = {
    'title': null,
    'download': false,
    'thumbnails': false,
    'openOn': 'click',
  };

  options = Object.assign(defaultOptions, options);

  Vue.directive('image', {
    update(el, binding, vnode, oldVnode) {
      let altUpdated;
      let srcUpdated;

      if (oldVnode.data.attrs && vnode.data.attrs) {
        srcUpdated = oldVnode.data.attrs.src !== vnode.data.attrs.src;
      }

      const bindingValueUpdated = binding.oldValue !== binding.value;

      if (srcUpdated || altUpdated || bindingValueUpdated) {
        addImageAttributes(el, binding, options);
      }
    },

    //  Get all v-image directives
    bind(el, binding) {
      //  Check DOM has children
      if (el.children.tagName !== 'IMG' && el.children.length > 0 && !el.src) {
        const groupOptions = {
          'group': el.dataset.group || null,
          'title': el.title || null,
          'thumbnails': ga(el, 'data-thumbnails') || false,
          'download': ga(el, 'data-download') || false,
          'events': {},
        };
        options = Object.assign(options, groupOptions);
        //  Reset tagName not go follow to url on `a` tag
        if (el.tagName === 'A') {
          el.setAttribute('data-href', el.href);
          el.setAttribute('href', 'javascript:void(0);');
        }
        //  Begin set listener
        for (let index = 0; index < el.children.length; index++) {
          const children = el.children[index];
          if (children.tagName === 'IMG') {
            vImageListener(children, binding, options);
          } else {
            for (let i = 0; i < children.children.length; i++) {
              if (children.children[i].tagName === 'IMG') {
                vImageListener(children.children[i], binding, options);
              }
            }
          }
        }
      } else {
        // This is image
        vImageListener(el, binding, options);
      }

      /**
       * Make Image event Listener
       *-------------------
       * @author malayvuong
       * @param {Element} el
       * @param {Object} binding
       * @param {Object} options
       *
      **/
      function vImageListener(el, binding, options) {
        const addedAttributes = addImageAttributes(el, binding, options);
        // Finding existing vm, or creating new one
        let vm = window.vueImg;
        if (!vm) {
          const element = document.createElement('div');
          element.setAttribute('id', 'v-image');
          document.querySelector('body').appendChild(element);
          // eslint-disable-next-line no-multi-assign
          vm = window.vueImg = new Screen().$mount('#v-image');
        }

        // Updating vm's data
        el.addEventListener(addedAttributes.openOn, () => {
          let images;
          const groupName = el.dataset.group;
          if (!groupName) {
            images = [el];
          } else {
            images = [
              ...document.querySelectorAll(`img[data-group="${groupName}"]`),
            ];
          }

          Vue.set(vm, 'images', images.map((e) => e.dataset.src));
          Vue.set(vm, 'thumbs', images.map((e) => ga(e, 'src')));
          Vue.set(vm, 'titles', images.map((e) => e.dataset.title));
          Vue.set(vm, 'download', images.map(
              (e) => e.dataset.download === 'true'));
          Vue.set(vm, 'thumbnails', el.dataset.thumbnails === 'true');
          Vue.set(vm, 'currentIndex', images.indexOf(el));
          Vue.set(vm, 'handlers', addedAttributes.events);
          Vue.set(vm, 'closed', false);
        });
      }
    },
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

export default install;
