<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import global from "$lib/global";
  import { onDestroy, onMount } from "svelte";
  let param;
  let students = [];
  onMount(async () => {
    if (typeof window == "undefined") {
      return;
    }
    students = await pb.collection("students").getFullList({
      filter: `Teacher ~ "${pb.authStore.model.id}"`,
    });
  });
</script>

<div
  class="card my-5 w-80 mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <div class="mb-2 mx-auto text-center">
    <h3>Search Student's Details</h3>
  </div>
  <div class="mincontent mx-auto">
    <button
      class="btn btn-secondary mt-2 w-100"
      on:click={() => {
        goto("/teacher");
      }}>Back</button
    >
    <table class="tabla stu">
      <thead class="bg-secondary">
        <th>Name</th>
        <th>
          <select bind:value={param} class="bg-secondary border-0">
            <option value="Tele_No">Phone Number</option>
            <option value="Address">Address</option>
            <option value="Registration_No">Registration Number</option>
            <option value="FANA">Father's Name</option>
            <option value="MONA">Mother's Name</option>
            <option value="DOB">Date OF Birth</option>
            <option value="ClassName">Class And Section</option></select
          ></th
        >
      </thead>
      {#each students as student}
        <tr class="bg-secondary">
          <td>{student.username}</td>
          <td>
            {#if student[param] != ""}
              {student[param]}
            {:else}
              Data Not Entered
            {/if}
          </td>
        </tr>
      {/each}
    </table>
  </div>
</div>

<style>
  .w-80 {
    width: 90vw;
  }
  .tabla.stu {
    text-align: center;
    margin-right: auto;
    margin-left: auto;
    vertical-align: middle;
    border-collapse: separate;
    overflow: hidden;
    border-spacing: 0 8px;
  }
  .tabla.stu tr,
  .tabla.stu thead {
    border-radius: 12px;
    overflow: hidden;
  }

  .tabla.stu td,
  .tabla.stu th {
    padding: 0.75em;
    padding-right: 1em;
    padding-left: 1em;
  }

  .tabla.stu td:first-child,
  .tabla.stu th:first-child {
    border-radius: 10px 0 0 10px;
  }

  .tabla.stu td:last-child,
  .tabla.stu th:last-child {
    border-radius: 0 10px 10px 0;
  }
</style>
