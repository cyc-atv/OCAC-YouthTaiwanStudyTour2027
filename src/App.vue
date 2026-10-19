<script setup>
import { useHead } from '@unhead/vue'
import { useTourData } from './composables/useSession'
import Header from './components/Header.vue'
import Navbar from './components/Navbar.vue'
import SectionBlock from './components/SectionBlock.vue'
import NewsList from './components/NewsList.vue'
import Session from './components/Session.vue'
import PlaceModal from './components/PlaceModal.vue'

useHead({
  htmlAttrs: {
    lang: 'zh-Hant-TW'
  },
  title: '僑務委員會2027年海外青年臺灣觀摩團',
  meta: [
    {
      name: 'description',
      content: '僑務委員會2027年海外青年臺灣觀摩團'
    },
    {
      name: 'author',
      content: '僑務委員會 & 中國青年救國團'
    },
    {
      name: 'keywords',
      content: '僑務委員會,海外青年,臺灣觀摩團,2027'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://cyc-atv.github.io/OCAC-YouthTaiwanStudyTour2027/'
    }
  ]
})

const { sessions, headerNews } = useTourData()
</script>

<template>
  <Navbar>
    <template #brand>
      <a href="#" class="nav-link justify-content-start align-items-center d-flex">
        <span class="d-none d-md-inline">僑務委員會2027年海外青年臺灣觀摩團</span>
        <span class="d-md-none">2027臺灣觀摩團</span>
      </a>
    </template>
  </Navbar>
  <Header>
    <img src="/img/header/banner.jpg" class="img-fluid" alt="banner">
  </Header>
  <SectionBlock id="about" :top-gap-level="5" :bottom-gap-level="5">
    <hgroup>
      <h1>關於觀摩團</h1>
      <p class="mb-0">About Overseas Youth Taiwan Study Tour</p>
    </hgroup>
    <p>為增進海外青年對中華民國臺灣發展之瞭解，並促進海內外青年互動交流，於返回僑居地後，成為僑社新生力量，增進中華民國臺灣與當地國之交流聯繫，僑務委員會自1983年起，陸續舉辦多屆「海外青年觀摩團」，邀請海外優秀青年返國參訪。</p>
    <p>2027年僑務委員會再度舉辦「2027僑務委員會海外青年觀摩團」，邀請身為海外青年的您來到這座寶島，一起來發掘中華民國臺灣的美麗！</p>
    <div class="mt-2">
      <a href="https://register.ocac.gov.tw/cht/index.php" target="_blank" class="btn btn-primary btn-lg">現在就報名！</a>
    </div>
  </SectionBlock>
  <SectionBlock id="news" :top-gap-level="5" :bottom-gap-level="5">
    <h2>最新消息</h2>
    <NewsList :items="headerNews"></NewsList>
  </SectionBlock>
  <SectionBlock id="sessionRoot" :top-gap-level="5" :bottom-gap-level="5">
    <Session v-for="session in sessions" :key="session.id" :session="session"></Session>
  </SectionBlock>
  <footer>
    <p>僑務委員會 2027 Overseas Youth Observation Group © All Rights Reserved.</p>
  </footer>
  <PlaceModal/>
</template>

<style scoped></style>

<style>
html { scroll-padding-top: 70px; }
</style>