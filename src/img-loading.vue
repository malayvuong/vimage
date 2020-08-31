<template>
  <div class="v-load-image">
    <transition v-if="status === 'loaded'" mode="out-in" name="v-slide-fade">
      <slot name="image" />
    </transition>
    <slot v-else-if="status === 'failed'" name="error" />
    <slot v-else-if="status === 'loading'" name="preloader" />
    <transition v-if="status !== 'loaded'" mode="out-in" name="v-slide-fade">
      <slot name="bg-loader" />
    </transition>
  </div>
</template>

<script>
const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};

export default {
  data() {
    return {
      status: null,
      img: null,
      src: null,
    };
  },
  created() {
    const {attrs} = this.$slots.image[0].data;
    this.src = attrs.src || attrs['data-src'];
    if (this.src) {
      this.status = Status.LOADING;
      this.createLoader();
      return;
    }
    this.status = Status.PENDING;
  },
  updated() {
    const {attrs} = this.$slots.image[0].data;
    const receivedSrc = attrs.src || attrs['data-src'];
    if (this.status === Status.LOADING && !this.img) {
      this.createLoader();
      return;
    }
    if (this.src !== receivedSrc) {
      this.src = receivedSrc;
      this.createLoader();
    }
  },
  watch: {
    src(value) {
      this.status = value ? Status.LOADING : Status.PENDING;
    },
  },
  methods: {
    createLoader() {
      this.destroyLoader();
      this.img = new Image();
      this.img.onload = this.handleLoad;
      this.img.onerror = this.handleError;
      this.img.src = this.src;
    },
    destroyLoader() {
      if (this.img) {
        this.img.onload = null;
        this.img.onerror = null;
        this.img = null;
      }
    },
    handleLoad() {
      this.destroyLoader();
      this.status = Status.LOADED;
      this.$emit('onLoad');
    },
    handleError(error) {
      this.destroyLoader();
      this.status = Status.FAILED;
      this.$emit('onError', error);
    },
  },
};
</script>
<style lang="stylus">
.v-image-fade-enter,
.v-image-fade-leave-to {
  opacity: 0;
}

.v-image-fade-enter-active,
.v-image-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-slide-fade-enter-active {
  transition: all .3s ease;
}
.v-slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.v-slide-fade-enter, .v-slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
