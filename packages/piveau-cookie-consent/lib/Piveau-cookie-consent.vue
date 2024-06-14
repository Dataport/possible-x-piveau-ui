/*
Adapted vue-cookie-accept-decline from https://github.com/promosis/vue-cookie-accept-decline/tree/7172ae4f2e7af2584a0e1d84b78be37b4a3c1be7
Modified to not do anything persistent until given consent.
*/

<template>
  <transition appear :name="transitionName">
    <div class="cookie" :class="['cookie__' + type, 'cookie__' + type + '--' + position]" v-if="isOpen" :id="elementId">
      <div :class="'cookie__' + type + '__wrap'">
        <div v-if="showPostponeButton === true" @click="postpone" :class="'cookie__' + type + '__postpone-button'" title="Close">
          <slot name="postponeContent">
            &times;
          </slot>
        </div>

        <div :class="'cookie__' + type + '__content'">
          <slot name="message">
            We use cookies to ensure you get the best experience on our website. <a href="https://cookiesandyou.com/" target="_blank">Learn More...</a>
          </slot>
        </div>

        <div :class="'cookie__' + type + '__buttons'">
          <button id="cookie-btn-accept" @click="accept" :class="['cookie__' + type + '__buttons__button', 'cookie__' + type + '__buttons__button--accept']">
            <slot name="acceptContent">
              Got It!
            </slot>
          </button>
          <button id="cookie-btn-decline" @click="decline" v-if="disableDecline === false" :class="['cookie__' + type + '__buttons__button', 'cookie__' + type + '__buttons__button--decline']">
            <slot name="declineContent">
              Opt Out
            </slot>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import * as tinyCookie from 'tiny-cookie'; // eslint-disable-line

export default {
  name: 'Piveau-cookie-consent',
  props: {
    elementId: {
      type: String,
      required: true,
    },

    debug: {
      type: Boolean,
      default: false,
    },

    disableDecline: {
      type: Boolean,
      default: false,
    },

    // floating: bottom-left, bottom-right, top-left, top-right
    // bar:  bottom, top
    position: {
      type: String,
      default: 'bottom-left',
    },

    // floating, bar
    type: {
      type: String,
      default: 'floating',
    },

    // slideFromBottom, slideFromTop, fade
    transitionName: {
      type: String,
      default: 'slideFromBottom',
    },

    showPostponeButton: {
      type: Boolean,
      default: false,
    },

    cookie: {
      type: String,
      default: 'piveau-cookie-accept-decline-state'
    },

    cookieExpires: {
      type: String,
      default: '100D'
    },

    noCookiesUntilConsent: {
      type: Boolean,
      default: false,
    },

    cookieConfig: {
      type: Object,
      default: () => ({ acceptValue: '2', declineValue: '0', postponeValue: '1' }),
    },
  },
  data() {
    return {
      status: null,
      supportsLocalStorage: false,
      isOpen: false,
      cookiesAllowed: false,
    };
  },
  computed: {
    containerPosition() {
      return `cookie--${this.position}`;
    },
    containerType() {
      return `cookie--${this.type}`;
    },
  },
  mounted() {
    this.checkLocalStorageFunctionality();
    this.init();
  },
  methods: {
    init() {
      if (!this.noCookiesUntilConsent) {
        this.cookiesAllowed = true;
      }
      const visitedType = this.getCookieStatus();
      if (visitedType && (visitedType === 'accept' || visitedType === 'decline' || visitedType === 'postpone')) {
        this.isOpen = false;
      }

      if (!visitedType) {
        this.isOpen = true;
      }

      this.status = visitedType;
      this.$emit('status', visitedType);
    },
    checkLocalStorageFunctionality() {
      // Check for availability of localStorage
      //   try {
      //     const test = '__vue-cookie-accept-decline-check-localStorage';
      //     window.localStorage.setItem(test, test);
      //     window.localStorage.removeItem(test);
      //   } catch (e) {
      //     console.error('Local storage is not supported, falling back to cookie use');
      //     this.supportsLocalStorage = false;
      //   }
      this.supportsLocalStorage = false;
    },
    setCookieStatus(type) {
      if (this.supportsLocalStorage) {
        if (type === 'accept') {
          localStorage.setItem(`${this.cookie}`, this.cookieConfig.acceptValue);
        }
        if (type === 'decline') {
          localStorage.setItem(`${this.cookie}`, this.cookieConfig.declineValue);
        }
        if (type === 'postpone') {
          localStorage.setItem(`${this.cookie}`, this.cookieConfig.postponeValue);
        }
      } else {
        if (type === 'accept') {
          this.setCookie(`${this.cookie}`, this.cookieConfig.acceptValue);
        }
        if (type === 'decline') {
          this.setCookie(`${this.cookie}`, this.cookieConfig.declineValue);
        }
        if (type === 'postpone') {
          this.setCookie(`${this.cookie}`, this.cookieConfig.postponeValue);
        }
      }
    },
    getCookieStatus() {
      if (this.supportsLocalStorage) {
        return localStorage.getItem(`${this.cookie}`);
      }

      const cookieStatus = tinyCookie.get(`${this.cookie}`);
      const { acceptValue, declineValue, postponeValue } = this.cookieConfig;

      switch (cookieStatus) {
        case acceptValue:
          return 'accept';
        case declineValue:
          return 'decline';
        case postponeValue:
          return 'postpone';
        default:
          return cookieStatus || null;
      }
    },
    accept() {
      if (!this.debug) {
        this.cookiesAllowed = true;
        this.setCookieStatus('accept');
      }
      this.status = 'accept';
      this.isOpen = false;
      this.$emit('clicked-accept');
    },
    decline() {
      if (!this.debug) {
        this.setCookieStatus('decline');
      }
      this.status = 'decline';
      this.isOpen = false;
      this.$emit('clicked-decline');
    },
    postpone() {
      if (!this.debug) {
        this.setCookieStatus('postpone');
      }
      this.status = 'postpone';
      this.isOpen = false;
      this.$emit('clicked-postpone');
    },
    removeCookie() {
      localStorage.removeItem(`${this.cookie}`);
      tinyCookie.removeCookie(this.cookie)
      this.status = null;
      this.$emit('removed-cookie');
    },
    setCookie(key, value) {
      if (this.cookiesAllowed) {
        tinyCookie.set(`${key}`, `${value}`, { expires: this.cookieExpires, secure: true  });
      }
    },
  },
};
</script>

<style scoped lang="scss">
$lighter-grey: #eee;
$light-grey: #ddd;
$grey: darken($light-grey, 9%);
$green: #4caf50;
$dark-green: darken($green, 8%);
$red: #f44336;
$dark-red: darken($red, 8%);
$white: #fff;
$off-white: darken($white, 2%);
$black: #333;
$transition: all 0.2s ease;

.cookie-more-info-button {
  padding: 0;
  display: block;
  background-color: transparent;
  outline: none;
  text-decoration: underline;
  border: none;
}

.cookie-accept-button {
  background-color: transparent;
  border: none;
  outline: none;
  margin-right: 5px;
}

.cookie {
  // Bar
  &__bar {
    -ms-overflow-style: none;
    position: fixed;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 9999;
    width: 100%;
    padding: 10px 0;
    background: $lighter-grey;
    align-items: center;
    box-shadow: 0 -4px 4px rgba($grey, 0.05);
    border: none;
    font-size: 1rem;
    font-family: "Ubuntu", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, “Fira Sans”, “Droid Sans”, “Helvetica Neue”, Arial, sans-serif;
    line-height: 1.5;

    &--bottom {
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
    }

    &--top {
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
    }

    &__wrap {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 95%;

      @media (min-width: 601px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 80%;
      }
    }

    &__postpone-button {
      margin-right: auto;
      -ms-flex: 1 1 auto;

      @media (min-width: 601px) {
        margin-right: 10px;
      }

      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }

    &__content {
      margin-bottom: 20px;
      font-size: 1rem;
      max-height: 103px;
      overflow: auto;
      min-width: 200px;
      width: auto;
      -ms-flex: 1 1 auto;

      @media (min-width: 601px) {
        margin-bottom: 0;
        margin-right: 20px;
      }
    }

    &__buttons {
      transition: $transition;
      display: flex;
      flex-direction: row;
      width: 100%;

      @media (min-width: 601px) {
        flex-direction: row;
        width: auto;
      }

      &__button {
        display: inline-block;
        font-weight: 400;
        font-family: inherit;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        line-height: 1.5;
        border-radius: 3px;
        font-size: 0.9rem;

        &:hover {
          cursor: pointer;
          text-decoration: none;
        }

        &--accept {
          -ms-flex: 1 1 auto;
          background: $green;
          background: linear-gradient(lighten($green, 5%), $green);
          color: $white;
          margin-right: 10px;

          &:hover {
            background: $dark-green;
          }
        }

        &--decline {
          -ms-flex: 1 1 auto;
          background: $red;
          background: linear-gradient(lighten($red, 5%), $red);
          color: $white;
          font-weight: bold;
          margin-bottom: 0px;
          margin-right: 0px;

          &:hover {
            background: $dark-red;
          }
        }
      }
    }
  }

  // Floating
  &__floating {
    -ms-overflow-style: none;
    position: fixed;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 9999;
    width: 90%;
    background: $off-white;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba($grey, 0.3);
    border: 1px solid $light-grey;
    font-size: 1rem;
    font-family: "Ubuntu", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, “Fira Sans”, “Droid Sans”, “Helvetica Neue”, Arial, sans-serif;
    line-height: 1.5;
    border-radius: 6px;

    @media (min-width: 601px) {
      max-width: 300px;
    }

    // For now I think the best idea is to show the panel centered
    // and on the bottom when on small screens
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;

    @media (min-width: 601px) {
      &--bottom-left {
        bottom: 20px;
        left: 20px;
        right: auto;
        margin: 0 0;
      }
    }

    @media (min-width: 601px) {
      &--bottom-right {
        bottom: 20px;
        right: 20px;
        left: auto;
        margin: 0 0;
      }
    }

    @media (min-width: 601px) {
      &--top-right {
        top: 20px;
        bottom: auto;
        right: 20px;
        left: auto;
        margin: 0 0;
      }
    }

    @media (min-width: 601px) {
      &--top-left {
        top: 20px;
        bottom: auto;
        right: auto;
        left: 20px;
        margin: 0 0;
      }
    }

    &__postpone-button {
      display: inline-flex;
      padding: 5px 0 0 20px;
      margin-bottom: -10px;
      margin-right: auto;

      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }

    &__content {
      font-size: 0.95rem;
      margin-bottom: 5px;
      padding: 15px 20px;
      max-height: 105px;
      overflow: auto;
    }

    &__buttons {
      transition: $transition;
      display: flex;
      flex-direction: row;
      height: auto;
      width: 100%;

      &__button {
        background-color: $lighter-grey;
        font-weight: bold;
        font-size: 0.90rem;
        width: 100%;
        min-height: 40px;
        white-space: nowrap;
        user-select: none;
        border-bottom: 1px solid $light-grey;
        border-top: 1px solid $light-grey;
        border-left: none;
        border-right: none;
        padding: 0.375rem 0.75rem;

        &:first-child {
          border-right: 1px solid $light-grey;
        }

        &:hover {
          cursor: pointer;
          text-decoration: none;
        }

        &--accept {
          color: $green;
          -ms-flex: 1 1 auto;

          &:hover {
            background: $dark-green;
            color: $white;
          }
        }

        &--decline {
          color: $red;
          -ms-flex: 1 1 auto;

          &:hover {
            background: $dark-red;
            color: $white;
          }
        }
      }
    }
  }
}

// Animations
// slideFromBottom
.slideFromBottom-enter, .slideFromBottom-leave-to {
  transform: translate(0px, 10em);
}

.slideFromBottom-enter-to, .slideFromBottom-leave {
  transform: translate(0px, 0px);
}

.slideFromBottom-enter-active {
  transition: transform .2s ease-out;
}

.slideFromBottom-leave-active {
  transition: transform .2s ease-in;
}

// slideFromTop
.slideFromTop-enter, .slideFromTop-leave-to {
  transform: translate(0px, -10em);
}

.slideFromTop-enter-to, .slideFromTop-leave {
  transform: translate(0px, 0px);
}

.slideFromTop-enter-active {
  transition: transform .2s ease-out;
}

.slideFromTop-leave-active {
  transition: transform .2s ease-in;
}

// fade
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
