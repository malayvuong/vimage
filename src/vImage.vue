<template>
<transition mode="out-in" name="v-image-fade">
  <div v-if="!closed" class="v-image-bg" @click.self="close">
    <div class="v-image-header">
      <span class="v-image-count">
        <span v-if="images.length > 1">
          {{ currentIndex + 1 }}/{{ images.length }}
        </span>
      </span>
      <span class="v-image-title">
        {{ titles[currentIndex] }}
      </span>
      <div class="v-image-buttons">
        <span v-if="download[currentIndex]">
          <a :href="images[currentIndex]" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"/></svg>
          </a>
        </span>
        <span @click="close">&times;</span>
      </div>
    </div>

    <transition mode="out-in" name="v-image-fade">
      <span v-if="visibleUI && images.length !== 1"
        class="v-image-prev" @click="prev">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path filf="#fff" d="M400 480H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm-60-268H224v-70.9c0-10.7-13-16.1-20.5-8.5L89.2 247.5c-4.7 4.7-4.7 12.2 0 16.9l114.3 114.9c7.6 7.6 20.5 2.2 20.5-8.5V300h116c6.6 0 12-5.4 12-12v-64c0-6.6-5.4-12-12-12z"/></svg>
      </span>
    </transition>
    <transition mode="out-in" name="v-image-fade">
      <span v-if="visibleUI && images.length !== 1"
        class="v-image-next" @click="next">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M48 32h352c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm60 268h116v70.9c0 10.7 13 16.1 20.5 8.5l114.3-114.9c4.7-4.7 4.7-12.2 0-16.9l-114.3-115c-7.6-7.6-20.5-2.2-20.5 8.5V212H108c-6.6 0-12 5.4-12 12v64c0 6.6 5.4 12 12 12z"/></svg>
      </span>
    </transition>

    <div class="v-image-footer" v-if="thumbnails">
      <img
        v-for="(thumbnail, index) in thumbs"
        :key="index"
        :src="thumbnail"
        @click="select(index)"
        :class="{'is-selected': currentIndex == index}">
    </div>

    <div class="v-image-body">
      <img-loading
        v-if="images[currentIndex] && images[currentIndex].length > 0">
        <img slot="image" :src="images[currentIndex]" @click="next" alt=" ">
        <div class="loader" slot="preloader"></div>
        <img class="blur" slot="bg-loader"
          :src="thumbs[currentIndex] || images[currentIndex] || null" alt="">
      </img-loading>
      <div v-else class="no-image-src">
        <span class="error-content">Image not found.</span>
      </div>
    </div>

  </div>
</transition>
</template>

<script>
import './style.scss';
//  Visit https://www.npmjs.com/package/vue-load-image to read more about image-loading
import ImgLoading from './img-loading.vue';

export default {
  data() {
    return {
      images: [], thumbs: [], titles: [], download: [],
      visibleUI: true,
      currentIndex: 0,
      closed: true,
      uiTimeout: null,
      handlers: {},
      thumbnails: false,
    };
  },
  components: {
    'img-loading': ImgLoading,
  },
  watch: {
    closed(newVal) {
      if (newVal && this.handlers.closed) {
        this.handlers.closed();
      }
      if (!newVal && this.handlers.opened) {
        this.handlers.opened();
      }
    },
  },
  methods: {
    // Not using currentIndex watcher because it will
    // fire on all cases when opened not first image and
    // index should be changed in order to show clicked image
    // in the image set.
    fireChangeEvent() {
      if (this.handlers.changed) {
        this.handlers.changed(this.currentIndex);
      }
    },
    close() {
      if (!this.closed) {
        this.images = [];
        this.currentIndex = 0;
        this.closed = true;
      }
    },
    next() {
      if (!this.closed && this.images.length > 1) {
        //  if next index not exists in array of images,
        //  set index to first element
        if (this.currentIndex + 1 < this.images.length) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }
        this.fireChangeEvent();
      }
    },
    select(selectedImage) {
      this.currentIndex = selectedImage;
    },
    prev() {
      if (!this.closed && this.images.length > 1) {
        //  if prev index not exists in array of images,
        //  set index to last element
        if (this.currentIndex > 0) {
          this.currentIndex--;
        } else {
          this.currentIndex = this.images.length - 1;
        }
        this.fireChangeEvent();
      }
    },
    showUI() {
      if (!this.closed) {
        // UI's hidden, we reveal it for some time only on mouse move and
        // ImageScreen appear
        clearTimeout(this.uiTimeout);
        this.visibleUI = true;
        this.uiTimeout = setTimeout(() => {
          this.visibleUI = false;
        }, 5000);
      }
    },
  },
  created() {
    window.addEventListener('keyup', (e) => {
      // esc key and 'q' for quit
      if (e.keyCode === 27 || e.keyCode === 81) this.close();
      // arrow right and 'l' key (vim-like binding)
      if (e.keyCode === 39 || e.keyCode === 76) this.next();
      // arrow left and 'h' key (vim-like binding)
      if (e.keyCode === 37 || e.keyCode === 72) this.prev();
    });
    window.addEventListener('scroll', () => {
      this.close();
    });
    window.addEventListener('mousemove', () => {
      this.showUI();
    });
  },
};
</script>
