<h1 align="center">vImage (Vue Image lightbox viewer)</h1>

<p align="center">
  <a href="https://circleci.com/gh/malayvuong/vimage/tree/dev"><img src="https://img.shields.io/circleci/project/github/malayvuong/vimage/dev.svg?sanitize=true" alt="Build Status"></a>
  <a href="https://npmcharts.com/compare/@ispa.io/vimage?minimal=true"><img src="https://img.shields.io/npm/dm/@ispa.io/vimage.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@ispa.io/vimage"><img src="https://img.shields.io/npm/v/@ispa.io/vimage.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@ispa.io/vimage"><img src="https://img.shields.io/npm/l/@ispa.io/vimage.svg?sanitize=true" alt="License"></a>
  <a href="https://m.me/malayvuong"><img src="https://img.shields.io/badge/chat-messenger-green" alt="Chat"></a>
</p>

`v-image` is a plugin for Vue.js that allows you to show images in full-screen gallery by adding only one directive to the tag. This project created and used for <a href="https://ispa.io">iSPA CMS</a>, so if you used this package, please noted that we may not check your issue or request.

## Table of contents

- [Getting started](#getting-started)
- [Props](#props)
- [Milestone](#milestone)
- [Versioning](#versioning)
- [License](#license)

## Milestone
- [ ] srcSet attributes support
- [ ] Custom download buttons group for srcSet
- [ ] Custom Icons (Download, Arrows, Close)
- [ ] Video support
- [ ] Picture tag support
- [ ] Gallery Auto play
- [ ] Integrate with el-image (Element UI)
## Getting started

### Install
```shell
npm i @ispa.io/vimage     // npm
```

### Usage
```js
import Vue from 'vue';
import vImage from '@ispa.io/vimage';

Vue.use(vImage);
```

### Optional configurations
In this snippet all settings has its default value. Don't specify them unless you want to change default behavior.
```javascript
const vImageConfig = {
  //  Global title
  'title': null,
  //  Show download button
  'download': false,
  //  Show thumbnails
  'thumbnails': false,
  //  on Event to show image
  'openOn': 'click',
}
Vue.use(vImage, vImageConfig);
```
### Example
**Grouping images list**

```html
<div v-image data-thumbnails title="global title">
  <img data-group="group-1" data-download src="..." data-src="..." alt="image 1">
  <img data-group="group-1" data-download src="..." data-src="..." alt="image 2">
  <img data-group="group-2" src="..." data-src="..." alt="image 3">
  <img data-group="group-2" src="..." data-src="..." alt="image 4">
</div>
```
OR
```html
<div v-image="{
  'group': 'group-name',
  'download': true,
  'thumbnails': true
}">
  <img src="..." data-src="..." alt="image 1">
  <img src="..." data-src="..." alt="image 2">
</div>
```
OR
```html
<img v-image data-group="group-1" data-download src="..." data-src="..." alt="image 1">
<img v-image data-group="group-1" data-download src="..." data-src="..." alt="image 2">
<img v-image data-group="group-2" src="..." data-src="..." alt="image 3">
<img v-image data-group="group-2" src="..." data-src="..." alt="image 4">
```

**Only one image**
```html
<img v-image data-download src="...">
```
OR
```html
<img v-image src="..." data-src="...">
```

### Options
| Option | Description | Default value | Data type |
| :----: | :---------: | :-----------: | :-------: |
| group  | Group name | null | String |
| data-src    | Image source that will be displayed in gallery | data-src attribute | String |
| src    | Image thumbnails | src attribute | String |
| title  | Caption that will be displayed | empty String or value of the `alt` attribute | String |
| openOn | Event listener to open gallery will be applied to tagName. Available options are all native JS events. | `click`/`dblclick`/`mouseover`... | String |
| data-download | Download button show | `false` | Boolean |
| data-thumbnails | Small thumbnails show (this thumb will be show by the `src` attribute) | `false` | Boolean |

This plugins has more options and will be available at next versions.

## Versioning

Maintained under the [Semantic Versioning guidelines](https://semver.org/).

## License

[MIT](https://opensource.org/licenses/MIT) © [Malayvuong](https://malayvuong.com/)

## Invite me a cup of coffee
If you like this project and want to contribute us, then you can send us a cup of coffee by this ways below:

| PAYPAL.ME            | MOMO App (Vietnam) |
|:--------------------:|:------------------:|
| <img src="./assets/qr-code-paypal.png" style="max-width: 100px;" alt="support us"> | <img src="./assets/qr-code-momo.jpg" style="max-width: 100px;" alt="support us"> |

[⬆ back to top](#table-of-contents)
