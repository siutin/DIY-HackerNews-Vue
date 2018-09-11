<template>
  <v-card class="row-item" :id="`row-item${this.id}`" v-touch="{
      left: () => onSwipe('Left'),
      right: () => onSwipe('Right')
    }">
    <v-progress-linear v-if="_.isEmpty(item)" :indeterminate="true"></v-progress-linear>
    <div class="wrapper">
       <v-layout row justify-space-between>
         <v-flex xs3 class="visit-link">
           <div @click="openVistLink" class="text">Go</div>
         </v-flex>
         <v-flex xs3 class="discuss-link">
           <router-link :to="{ name: 'store', params: { id: this.id }}" class="text">Discuss</router-link>
         </v-flex>
       </v-layout>
       <div class="static animate" @click="resetState" :style="{ 'transform': `translateX(${staticX}px)`, 'width': `${getClientWidth}px`}">
         <div class="">{{ item.title }}</div>
         <span class="grey--text">{{ getPostedAt }} | @{{ item.by }} | {{ getCommentCount }} comments </span>
       </div>
    </div>
  </v-card>
</template>

<script>
import Vue from 'vue'
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
    getClientWidth () { return document.body.clientWidth },
    getStaticClasses () { return this.staticClasses }
  },
  methods: {
    onApiComplete (data) {
      console.log(`onApiComplete - id: ${this.id}`)
      this.item = data
    },
    onSwipe (direction) {
      this.swipeDirection = direction
      let i, j
      if (direction === 'Right') {
        if (this.showDiscussLink) {
          this.showDiscussLink = false
          this.showVisitLink = false
          this.staticX = 0
        } else {
          this.showDiscussLink = false
          this.showVisitLink = true
          this.staticX = 100
        }
      } else if (direction === 'Left') {
        if (this.showVisitLink) {
          this.showDiscussLink = false
          this.showVisitLink = false
          this.staticX = 0
        } else {
          this.showDiscussLink = true
          this.showVisitLink = false
          this.staticX = -100
        }
      } else {
        this.showDiscussLink = false
        this.showVisitLink = false
        this.staticX = 0
      }
    },
    resetState (e) {
      console.log(`resetState`)
      this.showVisitLink = false
      this.showDiscussLink = false
      this.staticX = 0
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
    display: inline-block;
  }

  .static {
    background-color: white;
    margin-top: -85px;
    padding: 15pt;
  }

  .static.animate {
    -webkit-transition: -webkit-transform 300ms ease;
    -moz-transition: -moz-transform 300ms ease;
    transition: transform 300ms ease;
  }

  .visit-link {
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
  </style>
