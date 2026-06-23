# QQBB Postcard Diary Prototype

一个私密的双人每日问题明信片原型。每天两个人回答各自的问题，用旧明信片、纸张、胶带、邮戳和拼贴元素记录当天的回答。

## Run

```bash
npm install
python3 -m http.server 8877
```

Then open:

```text
http://127.0.0.1:8877/
```

## Test

```bash
npm test
```

## Notes

- The hero collage system is procedural and works without external image requests.
- The repository includes only a curated subset of local collage assets from `public/collage-optimized`.
- Generated screenshots, local dependencies, and unused large asset folders are ignored.
