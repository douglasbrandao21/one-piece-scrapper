import download from 'image-downloader';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const DIRNAME = '/home/magalu/Desktop/teste/teste1/output';

import ChapterItem from './interfaces/ChapterItem';

import CHAPTERS_FILE from './config/chapters.json';

function downloadImage(url: string, filepath: string) {
  return download.image({
     url,
     dest: filepath 
  });
}

async function main(chapterDownload: string) {
  const chapterObject = CHAPTERS_FILE.find((chapter: ChapterItem) => chapter.chapter === chapterDownload);

  if(chapterObject === undefined) return;

  const response = await axios.get(chapterObject.url);

  const images = cheerio('.js-pages-container .text-center img', response.data);

  for (let i = 0; i < images.length; i++) {
    const dir = `${DIRNAME}/${chapterObject.chapter}`;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await downloadImage(images[i].attribs.src, `${dir}/${i}.jpeg`);
  }
}

(async () => {
  try {
    for(let index = 0; index < CHAPTERS_FILE.length; index++) {
      await main(CHAPTERS_FILE[index].chapter);
    }
  } catch (e) {
      console.log(e)
  }
})();