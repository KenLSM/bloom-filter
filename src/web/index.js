const server = "http://localhost:5001/q";
// const server = "http://10.143.214.199:5001/q";

const SubmitBtn = document.getElementById("submitter");

const ResultsTxt = document.getElementById("result");

async function send(input) {
  console.log({ input });
  const msg = new FormData(document.querySelector("form"))
    .get("msg")
    .split(" ")[0]
    .trim();
  console.log({ form: msg });

  const p = await fetch(server + `/${msg}`, {
    mode: "no-cors",
    credentials: "include",
  });
  console.log(p);
}
SubmitBtn.onclick = send;
