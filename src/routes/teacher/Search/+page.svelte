<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import global from "$lib/global";
  import { onDestroy, onMount } from "svelte";
  let param = "";
  let paramLabel = "Select Data Type";
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
      onclick={() => {
        goto("/teacher");
      }}>Back</button
    >
    <div class="dropdown">
      <button
        class="w-100 form-select mt-2 mb-2 bg-secondary align-items-start"
        data-bs-toggle="dropdown"
      >
        {paramLabel}
      </button>

      <ul class="dropdown-menu w-100">
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "Tele_No";
              paramLabel = "Phone Number";
            }}>Phone Number</button
          >
        </li>
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "Address";
              paramLabel = "Address";
            }}>Address</button
          >
        </li>
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "Registration_No";
              paramLabel = "Registration Number";
            }}>Registration Number</button
          >
        </li>
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "FANA";
              paramLabel = "Father's Name";
            }}>Father's Name</button
          >
        </li>
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "MONA";
              paramLabel = "Mother's Name";
            }}>Mother's Name</button
          >
        </li>
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "DOB";
              paramLabel = "Date Of Birth";
            }}>Date Of Birth</button
          >
        </li>
        <li>
          <button
            class="dropdown-item"
            onclick={() => {
              param = "ClassName";
              paramLabel = "Class And Section";
            }}>Class And Section</button
          >
        </li>
      </ul>
    </div>
    <table class="tabla stu">
      <thead class="bg-secondary">
        <tr>
          <th>Name</th>
          <th>
            {paramLabel}
          </th>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
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
  .dropdown-menu {
    max-height: none !important;
    overflow: visible !important;
    z-index: 99999 !important;
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
