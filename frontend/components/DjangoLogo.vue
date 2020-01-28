<template>
  <img class="RotateLogo" alt="Django Logo" src="~/static/django.png" />
</template>

<style>
.RotateLogo {
  width: 180px;
  transform: rotateY(380deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
