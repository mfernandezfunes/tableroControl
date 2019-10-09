<template>
  <div class="hero" :style="{ backgroundImage: `url('${media}')` }">
    <div class="hero-inner">
      <h1 class="hero-title">{{title}}</h1>
      <div class="hero-description">{{message}}</div>
      <div class="hero-actions mt-4">
        <div class="btn btn-primary mr-3">{{primaryButtonText}}</div>
        <div class="btn btn-secondary">{{secondaryButtonText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseHero",
  data() {
    return {
      title: "Perros en la playa",
      message: `Son muchos los perros que al igual que sus amos,
                disfrutan de un buen día en la playa. En esta página encontrarás
                tips para cuidarlos correctamente.`,
      primaryButtonText: "Mejores playas para perros",
      secondaryButtonText: "Contáctanos",
      media: "/static/images/bg_hero.png"
    };
  }
};
</script>

<style>
</style>