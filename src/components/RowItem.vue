<template>
  <v-card class="row-item" :id="`row-item${this.id}`" v-touch="{
      left: () => onSwipe('Left'),
      right: () => onSwipe('Right')
    }">
    <v-progress-linear v-if="_.isEmpty(item)" :indeterminate="true"></v-progress-linear>
   <div class="wrapper">
     <transition name="expand">
         <div v-if="showVisitLink" class="visit-link"><div class="visit-link-text">Go</div></div>
     </transition>
     <v-card-title class="static">
       <div class="static">
         <div class="">{{ item.title }}</div>
         <span class="grey--text">{{ getPostedAt }} | @{{ item.by }} | {{ swipeDirection }} </span>
       </div>
       </v-card-title>
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
      item: {}
    }
  },
  computed: {
    getPostedAt () {
      return moment.unix(this.item.time).fromNow()
    }
  },
  methods: {
    onApiComplete (data) {
      console.log(`onApiComplete - id: ${this.id}`)
      this.item = data
    },
    onSwipe (direction) {
      this.swipeDirection = direction
      if (direction == 'Right') {
        this.showVisitLink = true
      } else {
        this.showVisitLink = false
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

  .v-card__title {
    background-color: white;
    width: 100%;
    padding: 10pt 20pt 10pt 20pt !important;
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

  .expand-enter-active, .expand-leave-active {
     transition: all 0.2s ease;
     width: 100px;
     opacity: 1;
  }
  .expand-enter, .expand-leave-to /* .fade-leave-active below version 2.1.8 */ {
     transition: all 0.2s ease;
     width: 0;
     opacity: 0;
  }
</style>
