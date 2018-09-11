<template>
  <v-card class="row-item" :id="`row-item${this.id}`">
    <v-progress-linear v-if="_.isEmpty(item)" :indeterminate="true"></v-progress-linear>
    <div class="wrapper" v-else>
      <v-touch @swipeleft="onSwipeLeft" @swiperight="onSwipeRight" @tap="resetState" :swipe-options="{ direction: 'horizontal' }">
        <div class="image" v-show="hasImage">
          <v-progress-circular v-if="_.isEmpty(image)" :indeterminate="true"></v-progress-circular>
          <transition name="fade">
            <img :src="image" v-show="!_.isEmpty(image)"/>
          </transition>
        </div>
        <div>
          <div class="visit-link">
            <div @click="openVistLink" class="text">Go</div>
          </div>
          <div class="discuss-link">
            <router-link :to="{ name: 'story', params: { id: this.id }}" class="text">Discuss</router-link>
          </div>
        </div>
        <div class="static animate" :style="{ 'transform': `translateX(${staticX}px) translateY(-85px)`, 'width': `${getClientWidth}px`}">
          <div>
            <div class="">{{ item.title }}</div>
            <span class="grey--text">{{ getPostedAt }} | @{{ item.by }} | {{ getCommentCount }} comments </span>
          </div>
        </div>
      </v-touch>
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  name: 'RowItem',
  props: {
    index: Number,
    id: Number,
    maxScrolledPage: Number,
    maxRowsPerPage: Number
  },
  data () {
    return {
      swipeDirection: 'None',
      showVisitLink: false,
      showDiscussLink: false,
      staticX: 0,
      item: {},
      image: ''
    }
  },
  watch: {
    id (newVal, oldVal) {
      this.$store.dispatch('syncHWStory', {
        id: this.id,
        callback: (data) => {
          this.onApiComplete(data)
          this.resetState()
        }
      })
    }
  },
  computed: {
    getPostedAt () { return moment.unix(this.item.time).fromNow() },
    getCommentCount () { return this.item.descendants },
    getClientWidth () { return document.body.clientWidth },
    getStaticClasses () { return this.staticClasses },
    hasImage () { return this.item.url !== undefined }
  },
  methods: {
    onApiComplete (data) {
      console.log(`onApiComplete - id: ${this.id}`)
      this.item = data
      this.$store.dispatch('getStoryScreenshot',
        {
          id: this.id,
          callback: screenshot => {
            let image = screenshot.data.replace(/_/g, '/').replace(/-/g, '+')
            this.image = `data:image/jpeg;base64,${image}`
          }
        })
    },
    onSwipeLeft () { !this.showVisitLink ? this.displayDiscussLink() : this.resetState() },
    onSwipeRight () { !this.showDiscussLink ? this.displayVisitLink() : this.resetState() },
    displayVisitLink () { this.controlState(false, true, 100) },
    displayDiscussLink () { this.controlState(true, false, -100) },
    resetState (e) { this.controlState(false, false, 0) },
    controlState (svl, sdl, sx) {
      console.log(`controlState - svl: ${svl} sdl: ${sdl} sx: ${sx}`)
      this.showVisitLink = svl
      this.showDiscussLink = sdl
      this.staticX = sx
    },
    openVistLink (e) {
      console.log(`openVistLink - id: ${this.id}`)
      if (this.item && this.item.url) {
        window.location.href = this.item.url
      }
    }
  },
  created () {
    console.log(`RowItem - created`)
    this.$store.dispatch('syncHWStory', { id: this.id, callback: this.onApiComplete })
  }
}
</script>

<style scoped lang="scss">

  .row-item {
    position: relative;
    max-height: 265px;
  }

  .wrapper {
    display: inline-block;
  }

  .image {
    height: 180px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-hack {
    position: relative;
  }

  .static {
    background-color: white;
    min-height: 85px;
    display: flex;
    align-items: center;
    padding-left: 10pt;
    padding-right: 10pt;

    position: relative;
  }

  .static.animate {
    -webkit-transition: -webkit-transform 300ms ease;
    -moz-transition: -moz-transform 300ms ease;
    transition: transform 300ms ease;
  }

  .visit-link {
    float: left;
    background-color: green;
    font-size: 0;
    width: 100px;
    height: 85px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    & > .text {
      color: white;
      font-size: 25pt;
      text-decoration: none;
    }
  }

  .discuss-link {
    float: right;
    background-color: orange;
    font-size: 0;
    width: 100px;
    height: 85px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    & > .text {
      color: white;
      font-size: 15pt;
      text-decoration: none;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  </style>
