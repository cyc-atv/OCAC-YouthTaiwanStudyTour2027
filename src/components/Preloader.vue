<script setup></script>

<template>
    <div class="preloader">
        <div class="circ1"></div>
        <div class="circ2"></div>
        <div class="circ3"></div>
        <div class="circ4"></div>
    </div>
</template>

<style scoped>
.preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fbe9b9;
      opacity: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      transition: 0.5s ease-in-out;
}

.preloader.fade-out {
    animation: fadeOut 0.5s ease-in-out forwards;
}

.preloader > div {
      background-color: #7f822b;
      height: 10px;
      width: 10px;
      border-radius: 50%;
      display: inline-block;
      animation: stretchdelay 0.7s infinite ease-in-out;
}

@keyframes stretchdelay {
   0%, 40%, 100% { 
        transform: translateY(0px);
   }
   20% {
        transform: translateY(-10px);
   }
}

.preloader .circ1 {
  animation-delay: 0;
}

.preloader .circ2 {
  animation-delay: 0.1s;
}

.preloader .circ3 {
  animation-delay: 0.2s;
}

.preloader .circ4 {
  animation-delay: 0.3s;
}
</style>