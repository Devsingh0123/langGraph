import embeddings from "./config/embeddings.js";



const vector = await embeddings.embedQuery(
    "mujhe paisa attract karne wala bracelet chahiye"
);


console.log(vector);
console.log(vector.length);