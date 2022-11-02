const { createApp } = Vue;

createApp({
  data() {
    return {
      activeClass: false,
      blueNotCalculated: true,
      redNotCalculated: true,
      stepEnd: false,
      gameNumber: 1,
      options: { step: 1, blueTeamScore: 0, redTeamScore: 0, totalScore: 0 },
      levels: [
        {
          symbol: "1",
          multiply: "1",
          answers: [
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
          ],
        },
        {
          symbol: "1",
          multiply: "1",
          answers: [
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
          ],
        },
        {
          symbol: "1",
          multiply: "1",
          answers: [
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
          ],
        },
        {
          symbol: "1",
          multiply: "1",
          answers: [
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
            {
              text: "",
              price: "",
            },
          ],
        },
      ],
    };
  },
  beforeMount() {
    this.getLevels();
  },
  mounted() {
    let data = this.getData();
    if (!data) {
      this.setData();
      this.options = this.getData();
    } else {
      this.options = this.getData();
    }
  },
  watch: {
    // number(n) {
    //   gsap.to(this, { duration: 1, tweened: Number(n) || 0 });
    // },
  },
  computed: {
    // formErrors: {
    //   get() {
    //     console.log(2);
    //     //console.log(this.forms[formName]);
    //     return true;
    //   },
    // },
  },
  methods: {
    async getLevels() {
      let url = new URL(window.location);
      let gameId = url.searchParams.get("game");
      this.gameNumber = gameId;
      let res = await fetch(`/data/game_0${this.gameNumber}.json`);
      res = await res.json();

      this.levels = res;
    },
    playFile() {
      let music = this.$refs.audio;
      music.play();
    },
    getData() {
      let data = JSON.parse(localStorage.getItem("options"));
      return data;
    },
    setData(step = false, reset = false) {
      if (reset) {
        localStorage.setItem(
          "options",
          JSON.stringify({
            step: 1,
            blueTeamScore: 0,
            redTeamScore: 0,
            totalScore: 0,
          })
        );
      } else {
        localStorage.setItem(
          "options",
          JSON.stringify({
            step: step ? this.options.step + 1 : this.options.step,
            blueTeamScore: this.options.blueTeamScore,
            redTeamScore: this.options.redTeamScore,
            totalScore: this.options.totalScore,
          })
        );
      }
    },
    calculateGame(teamWinner, price = 0) {
      document.querySelector(".audio-win").play();
      if (this.options.step === this.levels.length && price) {
        this.options[teamWinner + "TeamScore"] += parseInt(price);
        this[teamWinner + "NotCalculated"] = false;
      } else {
        this.options[teamWinner + "TeamScore"] += this.options.totalScore;
        this.options.totalScore = 0;
        this.setData();
        this.stepEnd = true;
      }
    },
    reset() {
      this.options = {
        step: 1,
        blueTeamScore: 0,
        redTeamScore: 0,
        totalScore: 0,
      };
      this.setData();
    },
    flipCard(e) {
      let card = $(e.target).closest(".card");
      card.toggleClass("is-flipped");

      let count = parseInt(card.find(".answer-price").text());
      if (card.is(".is-flipped")) {
        this.playFile();
        if (this.stepEnd || this.options.step == this.levels.length) return;
        this.options.totalScore +=
          count * parseInt(this.levels[this.options.step - 1].multiply);
      } else {
        if (this.stepEnd || this.options.step == this.levels.length) return;
        this.options.totalScore -=
          count * parseInt(this.levels[this.options.step - 1].multiply);
      }
    },
  },
})
  .component("custom-template", {
    template: `<div>
        <slot></slot>
        </div>`,
  })
  .mount("#app");

$(document).ready(() => {
  $(".errors-wrap > li").on("click", function () {
    if (!$(this).is(".is-active")) {
      document.querySelector(".wrong-audio").play();
    }
    $(this).toggleClass("is-active");
  });
});
