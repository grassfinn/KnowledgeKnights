<script>
  import { questions } from '../../assets/questions.json';
  import Question from './Question.svelte';
  let questionList = $state(questions);
  let currentQuestion = $derived(questionList[0]);
  const outOfQuestions = $derived(questionList.length > 0);
  let color = $state('');

</script>

<main>
  {#if !outOfQuestions}
    <p>Out of Questions</p>
  {:else}
    <Question question={currentQuestion} />
  {/if}
  <button onclick={() => questionList.shift()}>Push</button>
</main>

<style>
  main {
    max-width: 1200px;
  }

  h1 {
    font-size: 2rem;
  }

  ul {
    padding: 0;
    margin: 0 auto;
  }

  li {
    text-align: left;
    list-style: none;
  }

  .answer-choice {
    transition: background-color 0.5s;
  }

  button {
    width: 300px;
    min-height: 100px;
  }
  ul {
    margin-top: -0.7em;
    display: flex;
    width: 625px;
    flex-wrap: wrap;
    gap: 0.5em;
  }
</style>
