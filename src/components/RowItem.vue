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
    <v-card-title :class="getStaticClasses" @click="resetState" :style="{ 'width': `${getClientWidth}px`}">
      <div class="static">
        <div class="">{{ item.title }}</div>
        <span class="grey--text">{{ getPostedAt }} | @{{ item.by }} | {{ getCommentCount }} comments </span>
      </div>
    </v-card-title>
    </transition>
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
      staticClasses: ['static'],
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

        Vue._.each(['hide-visit-link', 'hide-discuss-link'], name => {
          let k = this.staticClasses.indexOf(name)
          if (k !== -1) this.staticClasses.splice(k, 1)
        })

        let [i, j] = [ this.staticClasses.indexOf('show-discuss-link'), this.staticClasses.indexOf('show-visit-link') ]
        if (i === -1 && j === -1) {
          this.staticClasses.push('show-visit-link')
        } else if (i !== -1) {
          this.staticClasses.splice(i, 1)
          this.staticClasses.push('hide-discuss-link')
        }

      } else if (direction === 'Left') {

        Vue._.each(['hide-visit-link', 'hide-discuss-link'], name => {
          let k = this.staticClasses.indexOf(name)
          if (k !== -1) this.staticClasses.splice(k, 1)
        })

        let [i, j] = [ this.staticClasses.indexOf('show-visit-link'), this.staticClasses.indexOf('show-discuss-link') ]
        if (i === -1 && j === -1) {
          this.staticClasses.push('show-discuss-link')
        } else if (i !== -1) {
          this.staticClasses.splice(j, 1)
          this.staticClasses.push('hide-visit-link')
        }

      } else {
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
    margin-top: -85px;
    position: relative;
    background-color: white;
  }

  .static.show-visit-link,
  .static.hide-visit-link,
  .static.show-discuss-link,
  .static.hide-discuss-link {
    animation-duration:0.5s;
    animation-timing-function:cubic-bezier(0.165, 0.84, 0.44, 1);
    animation-fill-mode: forwards;
  }

  .static.show-visit-link {
    animation-name: show-visit-link;
  }

  .static.hide-visit-link {
    animation-name: hide-visit-link;
  }

  .static.show-discuss-link {
    animation-name: show-discuss-link;
  }

  .static.hide-discuss-link {
    animation-name: hide-discuss-link;
  }

  @keyframes show-visit-link {
    from { left: 0; }
    to { left: 100px; }
  }

  @keyframes hide-visit-link {
    from { left: 100px; }
    to { left: 0; }
  }

  @keyframes show-discuss-link {
    from { left: 0; }
    to { left: -100px; }
  }

  @keyframes hide-discuss-link {
    from { left: -100px; }
    to { left: 0; }
  }

  .visit-link {
    background-color: green;
    font-size: 0;
    width: 100px;
    height: 85px;
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
  </style>
