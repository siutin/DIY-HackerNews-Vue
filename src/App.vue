<template>
  <v-app>
    <v-toolbar
      app
      :dark="toggleTheme"
    >
      <v-menu :nudge-width="100">
       <v-toolbar-title slot="activator">
         <span>{{ scopeTitles[getActiveScopeIndex] }}</span>
         <v-icon>arrow_drop_down</v-icon>
       </v-toolbar-title>

       <v-list>
         <v-list-tile
           v-for="(scopeTitle, i) in scopeTitles"
           :key="scopeTitle"
         >
           <v-list-tile-title v-text="scopeTitle" @click="(e) => onScopeClick(e, scopeTitle, i)"></v-list-tile-title>
         </v-list-tile>
       </v-list>
     </v-menu>
     <v-spacer></v-spacer>
      <v-toolbar-title>{{ getTitle }}</v-toolbar-title>
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

export default {
  name: 'App',
  data () {
    return {
      toggleTheme: false,
      title: 'Hacker News',
      scopeTitles: ['New', 'Top', 'Best']
    }
  },
  computed: {
    ...mapGetters([
      'getActiveScopeIndex'
    ]),
    getTitle () { return this.$store.getters.getTitle || this.title }
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
