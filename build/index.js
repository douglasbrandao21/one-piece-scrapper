"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_downloader_1 = __importDefault(require("image-downloader"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
const DIRNAME = '/home/magalu/Desktop/teste/teste1/output';
const chapters_json_1 = __importDefault(require("./config/chapters.json"));
function downloadImage(url, filepath) {
    return image_downloader_1.default.image({
        url,
        dest: filepath
    });
}
function main(chapterDownload) {
    return __awaiter(this, void 0, void 0, function* () {
        const chapterObject = chapters_json_1.default.find((chapter) => chapter.chapter === chapterDownload);
        if (chapterObject === undefined)
            return;
        const response = yield axios_1.default.get(chapterObject.url);
        const images = (0, cheerio_1.default)('.js-pages-container .text-center img', response.data);
        for (let i = 0; i < images.length; i++) {
            const dir = `${DIRNAME}/${chapterObject.chapter}`;
            if (!fs_1.default.existsSync(dir))
                fs_1.default.mkdirSync(dir, { recursive: true });
            yield downloadImage(images[i].attribs.src, `${dir}/${i}.jpeg`);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let index = 0; index < chapters_json_1.default.length; index++) {
            yield main(chapters_json_1.default[index].chapter);
        }
    }
    catch (e) {
        console.log(e);
    }
}))();
