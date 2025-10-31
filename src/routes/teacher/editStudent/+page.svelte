<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import global from "$lib/global";
  import { onDestroy, onMount } from "svelte";
  let student;
  onMount(async () => {
    if (typeof window == "undefined") {
      return;
    }
    student = await pb.collection("students").getOne(global.stuid);
  });

  async function update() {
    await pb.collection("students").update(global.stuid, student);
    goto("/teacher");
  }
</script>

{#if student}
  <div
    class="card my-5 w-80 mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
  >
    <div class="mb-2 mx-auto text-center"><h3>Edit Student's Details</h3></div>

    <label for="b">Username (No Space):</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.username}
      id="b"
    />

    <label for="i">Phone Number:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.Tele_No}
      id="i"
    />
    <label for="h">Address:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.Address}
      id="h"
    />

    <label for="g">Registration Number:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.Registration_No}
      id="g"
    />

    <label for="f">Father's Name:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.FANA}
      id="f"
    />

    <label for="e">Mother's Name:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.MONA}
      id="e"
    />
    <label for="d">Date Of Birth:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.DOB}
      id="d"
    />

    <label for="c">Class:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={student.ClassName}
      id="c"
    />
    <button
      class="btn btn-secondary mt-2"
      on:click={() => {
        goto("/teacher");
      }}>Back</button
    >
    <button class="btn btn-secondary mt-2" on:click={update}>Update</button>
  </div>
{/if}

<style>
  .w-80 {
    width: 90vw;
  }
</style>
