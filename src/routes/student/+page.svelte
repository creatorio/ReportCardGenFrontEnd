<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import { onDestroy, onMount } from "svelte";
  let subagraid;
  let grades = [];
  let unSubscribe = () => {};
  onMount(async () => {
    if (typeof window == "undefined") {
      return;
    }

    subagraid = pb.authStore.model.id;
    grades = await pb.collection("Grades").getFullList({
      filter: `Student ~ "${subagraid}"`,
    });
    unSubscribe = Subscribe();
  });
  function Subscribe() {
    // Subscribe to changes only in the specified record
    pb.collection("Grades").subscribe("*", function (e) {
      if (e.action === "create") {
        grades = [...grades, e.record];
      }
      if (e.action === "delete") {
        grades = grades.filter((r) => {
          return !(r.id == e.record.id);
        });
      }
    });
    // Unsubscribe
    return () => {
      pb.collection("Grades").unsubscribe();
    };
  }
  onDestroy(() => {
    unSubscribe();
  });
</script>

<div
  class="card my-5 w-80 mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <div>
    <button
      class="btn btn-secondary float-start text-light"
      on:click={() => {
        goto("/student/settings");
      }}><img src="/settings.png" width="30" height="30" /></button
    >
  </div>
  <div class="text-center">
    <div>
      <h3 class="mb-2 mx-auto">Your Grades</h3>
      <div class="table-responsive-md">
        <table class="tabla grd w-75">
          <thead class="bg-secondary">
            <th>Marks/M.M.</th>
            <th>Grade</th>
            <th>Type</th>
            <th>Subject</th>
            <th>Result</th>
            <th>Remark</th>
          </thead>
          {#each grades as grade, d}
            <tr class="bg-secondary">
              <td>{grade.ScoreValue}/{grade.maxmrk}</td>
              <td>{grade.Grade}</td>
              <td>{grade.Type}</td>
              <td>{grade.Subject}</td>
              <td>{grade.Result}</td>
              <td>{grade.Remark}</td>
            </tr>
          {/each}
        </table>
      </div>
    </div>
    {#if grades.length}
      <p>
        Total marks: {(() => {
          let total = 0;
          let totalmm = 0;
          for (let index = 0; index < grades.length; index++) {
            const e = grades[index];
            total += parseInt(e.ScoreValue);
            totalmm += parseInt(e.maxmrk);
          }

          return total + "/" + totalmm;
        })()}
      </p>
      <p>
        Percentage:{(() => {
          let total = 0;
          let totalmm = 0;
          for (let index = 0; index < grades.length; index++) {
            const e = grades[index];
            total += parseInt(e.ScoreValue);
            totalmm += parseInt(e.maxmrk);
          }
          return ((total / totalmm) * 100).toFixed(2);
        })()}%
      </p>
    {/if}
  </div>
</div>

<style>
  .tabla.grd {
    text-align: center;
    margin-right: auto;
    margin-left: auto;
    vertical-align: middle;
    border-collapse: separate;
    overflow: hidden;
    border-spacing: 0 8px;
  }
  .tabla.grd tr,
  .tabla.grd thead {
    border-radius: 12px;
    overflow: hidden;
  }

  .tabla.grd td,
  .tabla.grd th {
    padding: 4px;
    padding-right: 8px;
    padding-left: 8px;
  }

  .tabla.grd td:first-child,
  .tabla.grd th:first-child {
    border-radius: 10px 0 0 10px;
  }

  .tabla.grd td:last-child,
  .tabla.grd th:last-child {
    border-radius: 0 10px 10px 0;
  }
  .w-80 {
    width: 90vw;
  }
</style>
