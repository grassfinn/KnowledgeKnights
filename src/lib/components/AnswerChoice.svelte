<script>
  const { answer, correct } = $props();
  let bgColor = $state('');
  console.log(answer);

  function reset() {
    bgColor = '';
  }

  function check(e) {
    if (e.target.textContent === correct) {
      bgColor = 'green';
      setTimeout(() => {
        reset();
        // questionList.shift();
      }, 750);
    } else {
      bgColor = 'red';
    }
  }
</script>

<li>
  <button class="answer-choice" style:background-color={bgColor} onclick={check}
    >{answer}</button
  >
</li>

<style></style>
