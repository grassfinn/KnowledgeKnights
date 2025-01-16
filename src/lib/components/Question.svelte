<script>
  import AnswerChoice from './AnswerChoice.svelte';

  const { question } = $props();
  
</script>

<div>
  <h1>{question.question}</h1>
  <ul>
    {#each question.answers as answer, index (index)}
      <AnswerChoice answer={answer} correct={question.correct} />
    {/each}
  </ul>
</div>

<style></style>
