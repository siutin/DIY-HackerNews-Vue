<template>
  <v-card class="row-item" :id="`row-item${this.id}`" v-touch="{
      left: () => onSwipe('Left'),
      right: () => onSwipe('Right')
    }">
    <v-progress-linear v-if="_.isEmpty(item)" :indeterminate="true"></v-progress-linear>
   <v-layout row justify-space-between>
      <div class="visit-link"><div @click="openVistLink" class="text">Go</div></div>
      <div class="discuss-link"><router-link :to="{ name: 'store', params: { id: this.id }}" class="text">Discuss</router-link></div>
   </v-layout>
   <transition name="expand">
    <v-card-title class="static" @click="resetState" :style="{ 'left': `${staticLeft}px`, 'width': `${getClientWidth}px`}">
      <div class="static">
        <div class="">{{ item.title }}</div>
        <span class="grey--text">{{ getPostedAt }} | @{{ item.by }} | {{ getCommentCount }} comments </span>
      </div>
    </v-card-title>
    </transition>
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
      staticLeft: 0,
      item: {}
    }
  },
  watch: {
    id (newVal, oldVal) {
      this.$store.dispatch('syncHWStore', {
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
    getClientWidth () { return document.body.clientWidth }
  },
  methods: {
    onApiComplete (data) {
      console.log(`onApiComplete - id: ${this.id}`)
      this.item = data
    },
    onSwipe (direction) {
      this.swipeDirection = direction
      if (direction === 'Right') {
        if (!this.showVisitLink) {
          this.showVisitLink = true
          this.showDiscussLink = false
          this.staticLeft = 100
        } else {
          this.showVisitLink = false
          this.showDiscussLink = false
          this.staticLeft = 0
        }
      } else if (direction === 'Left') {
         if (!this.showDiscussLink) {
          this.showDiscussLink = true
          this.showVisitLink = false
          this.staticLeft = -100
        } else {
          this.showVisitLink = false
          this.staticLeft = 0
        }
      } else {
          this.showVisitLink = false
          this.showDiscussLink = false
          this.staticLeft = 0
      }
    },
    resetState (e) {
      console.log(`resetState`)
      this.showVisitLink = false
      this.showDiscussLink = false
      this.staticLeft = 0
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
    this.$store.dispatch('syncHWStore', { id: this.id, callback: this.onApiComplete })
  }
}
</script>

<style scoped lang="scss">

  .row-item {
    position: relative;
  }

  .wrapper {
    display: flex;
  }

  .v-card__title.static {
    margin-top: -60px;
    position: relative;
    background-color: white;
  }

  .visit-link {
    background-color: green;
    font-size: 0;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    & > .text {
      color: white;
      font-size: 25pt;
      text-align: center;
      text-decoration: none;
    }
  }

  .discuss-link {
    background-color: orange;
    font-size: 0;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    & > .text {
      color: white;
      font-size: 15pt;
      text-align: center;
      text-decoration: none;
    }
  }

  .expand-enter-active, .expand-leave-active {
     transition: margin-left 0.2s ease;
    //  width: 100px;
  }
  .expand-enter, .expand-leave-to /* .fade-leave-active below version 2.1.8 */ {
     transition: margin-left 0.2s ease;
    //  width: 0;
  }
</style>
