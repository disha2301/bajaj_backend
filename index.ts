import express, { Request, Response } from "express";
import cors from "cors";
import { fileTypeFromBuffer } from "./node_modules/file-type/core.js";

const app = express();
app.use(cors());
app.use(express.json());

function getMimeTypeFromArrayBuffer(arrayBuffer: Buffer) {
  const uint8arr = new Uint8Array(arrayBuffer);

  const len = 4;
  if (uint8arr.length >= len) {
    let signatureArr = new Array(len);
    for (let i = 0; i < len; i++)
      signatureArr[i] = new Uint8Array(arrayBuffer)[i].toString(16);
    const signature = signatureArr.join("").toUpperCase();

    switch (signature) {
      case "89504E47":
        return "image/png";
      case "47494638":
        return "image/gif";
      case "25504446":
        return "application/pdf";
      case "FFD8FFDB":
      case "FFD8FFE0":
        return "image/jpeg";
      case "504B0304":
        return "application/zip";
      default:
        return null;
    }
  }
  return null;
}

const convertDataToResponse = (data: string[]) => {
  const alphabets: string[] = [];
  const numbers: string[] = [];
  data.forEach((element) => {
    if (element.length !== 1) {
      numbers.push(element);
    } else {
      if (element.match(/[a-zA-Z]/i)) {
        alphabets.push(element);
      } else {
        numbers.push(element);
      }
    }
  });
  let highest_lowercase_alphabet = "";
  alphabets.forEach((alpha) => {
    if (alpha === alpha.toLowerCase()) {
      if (highest_lowercase_alphabet.length !== 0) {
        highest_lowercase_alphabet =
          alpha > highest_lowercase_alphabet
            ? alpha
            : highest_lowercase_alphabet;
      } else {
        highest_lowercase_alphabet = alpha;
      }
    }
  });
  return { numbers, alphabets, h_l_a: [highest_lowercase_alphabet] };
};

app.post("/bfhl", async (req: Request, res: Response) => {
  const { data, file_b64 } = req.body;
  if (!data) {
    return res.json({
      is_success: false,
      user_id: "disha_yadav_23012003",
      email: "da5048@srmist.edu.in",
      roll_number: "RA2111028010080",
      numbers: [],
      alphabets: [],
      highest_lowercase_alphabet: [],
      file_valid: false,
      file_mime_type: undefined,
      file_size_kb: 0,
    });
  }
  const { numbers, alphabets, h_l_a } = convertDataToResponse(data);
  if (!file_b64) {
    return res.json({
      is_success: true,
      user_id: "disha_yadav_23012003",
      email: "da5048@srmist.edu.in",
      roll_number: "RA2111028010080",
      numbers,
      alphabets,
      highest_lowercase_alphabet: h_l_a,
      file_valid: false,
      file_mime_type: undefined,
      file_size_kb: 0,
    });
  }
  const file_buffer = Buffer.from(file_b64);
  const file_mime_type = await fileTypeFromBuffer(file_buffer);
  console.log(file_mime_type);
  const file_size_kb = Buffer.byteLength(file_buffer) / 1024;
  return res.json({
    is_success: true,
    user_id: "disha_yadav_23012003",
    email: "da5048@srmist.edu.in",
    roll_number: "RA2111028010080",
    numbers,
    alphabets,
    highest_lowercase_alphabet: h_l_a,
    file_valid: true,
    file_mime_type,
    file_size_kb,
  });
});

app.get("/bfhl", (req: Request, res: Response) => {
  return res.json({ operation_code: "1" });
});

app.listen(4500, () => {
  console.log("Server started at port 4500");
});
