<template>
  <v-app>
    <v-toolbar
      app
      :dark="toggleTheme"
    >
      <v-menu :nudge-width="100">
       <v-toolbar-title slot="activator">
         <span>{{ getActiveScopeTitle }}</span>
         <v-icon>arrow_drop_down</v-icon>
       </v-toolbar-title>
       <v-list>
         <v-list-tile
           v-for="(scopeTitle, i) in getScopeTitles"
           :key="scopeTitle"
         >
           <v-list-tile-title v-text="scopeTitle" @click="(e) => onScopeClick(e, scopeTitle, i)"></v-list-tile-title>
         </v-list-tile>
       </v-list>
     </v-menu>

     <v-spacer></v-spacer>

      <v-toolbar-title>{{ getTitle || this.title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
         <v-icon>favorite</v-icon>
       </v-btn>
       <v-btn icon>
         <v-icon>more_vert</v-icon>
       </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { captialize } from './utils.js'

export default {
  name: 'App',
  data () {
    return {
      toggleTheme: false,
      title: 'Hacker News'
    }
  },
  computed: {
    ...mapGetters([
      'getActiveScopeName',
      'getScopeTitles',
      'getTitle'
    ]),
    getActiveScopeTitle () { return captialize(this.getActiveScopeName) }
  },
  methods: {
    onScopeClick (e, item, i) {
      console.log(`onScopeClick - item: ${item} i: ${i}`)
      let name = item.toLowerCase()
      this.$router.push({ name: 'scopes', params: { name } })
    }
  }
}
</script>
