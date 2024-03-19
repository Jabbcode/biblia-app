// import { useState } from "react";
// import axios from "axios";

// import { Book } from "@/types/Book";
// import { Verse } from "@/types/Vers";

const Home = () => {

  // const [chapters, setChapters] = useState<number[] | null>(null);
  // const [chapter, setChapter] = useState<number | null>(null);
  // const [rangeChapters, setRangeChapters] = useState<number[]>([]);
  // const [vers, setVers] = useState<Verse[]>([]);
  // const [book, setBook] = useState<Book>();

  // const calculateRangeChapters = async (idBook: number) => {
  //   const arrayAux = rangeChapters
  //   if (rangeChapters.length < 2) {
  //     arrayAux.push(idBook)
  //     if (idBook > rangeChapters[0]) {
  //       setRangeChapters(arrayAux)
  //     } else {
  //       setRangeChapters([arrayAux[0]])
  //     }
  //   }
  //   setChapter(idBook)
  // }

  // const getVersOfBook = async (nameBook: string, chapter: number, rangeChapters: number[]) => {
  //   console.log(rangeChapters.join("-"));

  //   const response = await axios.get(`https://bible-api.deno.dev/api/read/rv1960/${nameBook}/${chapter}/${rangeChapters.join("-")}`);
  //   setVers(response.data);
  //   setRangeChapters([])
  // }

  return (
    <></>
  )
};
export default Home;
