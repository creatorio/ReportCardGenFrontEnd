<script>
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase";
  import global from "$lib/global";
  import { onDestroy, onMount } from "svelte";
  let addingstu = false;
  let addinggrd = false;
  let subagraid;
  let seegrd = false;
  let name = "Name";
  let students = [];
  let grades = [];
  let newgrade = {
    ScoreValue: "",
    Grade: "",
    Subject: "",
    Type: "",
    Result: "",
    Remark: "",
    maxmrk: "",
  };
  let newstudent = {
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
  };
  let unSubscribe = () => {};
  onMount(async () => {
    if (typeof window == "undefined") {
      return;
    }
    students = await pb.collection("students").getFullList({
      filter: `Teacher ~ "${pb.authStore.model.id}"`,
    });
    unSubscribe = Subscribe();
  });
  function Subscribe() {
    // Subscribe to changes in any record in the collection
    pb.collection("Students").subscribe("*", function (e) {
      if (e.action === "create") {
        students = [...students, e.record];
      }
      if (e.action === "delete" && e.record.Teacher == pb.authStore.model.id) {
        students = students.filter((r) => {
          return !(r.id == e.record.id);
        });
      }
    });

    // Subscribe to changes only in the specified record
    pb.collection("Grades").subscribe("*", function (e) {
      if (e.action === "create" && e.record.Student == subagraid) {
        grades = [...grades, e.record];
      }
      if (e.action === "delete" && e.record.Student == subagraid) {
        grades = grades.filter((r) => {
          return !(r.id == e.record.id);
        });
      }
    });

    // Unsubscribe

    return () => {
      pb.collection("Students").unsubscribe(); // remove all 'RECORD_ID' subscriptions
      pb.collection("Grades").unsubscribe();
    };
  }
  onDestroy(() => {
    unSubscribe();
  });
  function createGrade() {
    newgrade.Student = subagraid;
    addinggrd = false;
    pb.collection("Grades").create(newgrade);
  }
  function createStudent() {
    newstudent.Teacher = pb.authStore.model.id;
    newstudent.password = "12345678";
    newstudent.passwordConfirm = "12345678";
    addingstu = false;
    pb.collection("Students").create(newstudent);
  }
  async function display(id, nampar) {
    if (typeof window == "undefined") {
      return;
    }
    subagraid = id;
    grades = await pb.collection("Grades").getFullList({
      filter: `Student ~ "${id}"`,
    });
    name = nampar;
  }
  async function deletestuff(stuff, id) {
    await pb.collection(stuff).delete(id);
    if (stuff === "Grades") {
      await display(subagraid);
    }
  }
  function addstu() {
    addingstu = true;
  }
  function addgrd() {
    addinggrd = true;
  }
  let input, filter, table, tr, td, i, txtValue;
  function Search() {
    // Declare variables
    filter = input.value.toUpperCase();
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  if (typeof window != "undefined") {
    console.log(window.innerWidth);
  }
</script>

<div
  class="card my-5 w-80 mx-4 p-2 bg-dark bg-opacity-75 border-0 shadow-lg backdrop-blur text-light"
>
  <div>
    <button
      class="btn btn-secondary float-start text-light"
      on:click={() => {
        goto("/teacher/settings");
      }}><img src="/settings.png" width="30" height="30" /></button
    >
  </div>
  {#if !(addinggrd || addingstu)}
    {#if !seegrd}
      <div class="text-center">
        <div>
          <h3 class="mb-2 mx-auto">Students</h3>
          <input
            class="form-control w-75 mx-auto bg-dark text-light border border-light border-2"
            placeholder="Search For Student(By Name)"
            bind:this={input}
            on:keyup={Search}
          />
          <div class="table-responsive-md">
            <table class="tabla stu w-75" bind:this={table}>
              <thead class="bg-secondary">
                <th>Name</th>
                <th>View Grades</th>
                <th>Edit</th>
                <th>Delete</th>
              </thead>
              {#each students as student, index}
                <tr class="bg-secondary">
                  <td>{student.username}</td>
                  <td
                    role="button"
                    on:click={() => {
                      display(student.id, student.username);
                      seegrd = true;
                    }}
                  >
                    View Grades
                  </td>
                  <td
                    role="button"
                    on:click={() => {
                      goto("/teacher/editStudent");
                      global.stuid = student.id;
                    }}>Edit</td
                  >
                  <td
                    role="button"
                    on:click={deletestuff("Students", student.id)}>Delete</td
                  >
                </tr>
              {/each}
            </table>
          </div>
          <button class="btn btn-secondary w-75 mt-2 mt-3" on:click={addstu}>
            Add Student
          </button>
          <button
            class="btn btn-secondary w-75 mt-2 mt-3"
            on:click={() => {
              goto("/teacher/Search");
            }}>Search Student Details</button
          >
        </div>
      </div>
    {:else if seegrd}
      <div class="text-center">
        <div>
          <h3 class="mb-2 mx-auto">Grades</h3>
          <div class="table-responsive-md">
            <table class="tabla grd w-75">
              <thead class="bg-secondary">
                <th>Marks/M.M.</th>
                <th>Grade</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Result</th>
                <th>Remark</th>
                <th>Delete</th>
              </thead>
              {#each grades as grade, d}
                <tr class="bg-secondary">
                  <td>{grade.ScoreValue}/{grade.maxmrk}</td>
                  <td>{grade.Grade}</td>
                  <td>{grade.Type}</td>
                  <td>{grade.Subject}</td>
                  <td>{grade.Result}</td>
                  <td>{grade.Remark}</td>
                  <td on:click={deletestuff("Grades", grade.id)} role="button"
                    >Delete
                  </td>
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
              if (!(addinggrd || addingstu)) {
                return total + "/" + totalmm;
              }
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
              if (!(addinggrd || addingstu)) {
                return ((total / totalmm) * 100).toFixed(2);
              }
            })()}%
          </p>
        {/if}
        <button
          class="btn btn-secondary w-50 text-center mx-auto my-2"
          on:click={() => {
            seegrd = false;
          }}>Back</button
        >
      </div>

      <button
        class="btn btn-secondary w-50 text-center mx-auto"
        on:click={addgrd}
      >
        Add Grade
      </button>
    {/if}
  {/if}
  {#if addingstu}
    <label>Enter Student's Name(use _ instead of space):</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newstudent.username}
    />
    <label>Enter Student's Email:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newstudent.email}
    />
    <button
      class="btn btn-secondary mt-2 float-end"
      on:click={() => {
        addingstu = false;
      }}>Back</button
    >
    <button class="btn btn-secondary mt-2 float-end" on:click={createStudent}
      >Add</button
    >
  {:else if addinggrd}
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Student's Marks:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.ScoreValue}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Maximum Marks In Subject:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.maxmrk}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Student's Grade:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.Grade}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Type Of Exam(Unit Or Term):</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.Type}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Subject:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.Subject}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Student's Result:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.Result}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Enter Your Remark:</label>
    <input
      class="form-control my-2 bg-dark text-light border border-light border-2"
      bind:value={newgrade.Remark}
    />
    <button
      class="btn btn-secondary mt-2 float-end"
      on:click={() => {
        addinggrd = false;
      }}>Back</button
    >
    <button class="btn btn-secondary mt-2 float-end" on:click={createGrade}
      >Add</button
    >
  {/if}
</div>

<style>
  .w-limited {
    max-width: 450px;
  }
  .w-80 {
    width: 90vw;
  }
  .w-40 {
    width: 35%;
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
  .stngico {
    vertical-align: middle;
  }
</style>
