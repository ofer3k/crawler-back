const puppeteer=require('puppeteer')
const cheerio=require('cheerio')
const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const app = express()
const port =process.env.PORT|| 3000

app.use(cors())
app.use(bodyParser())
app.post('/',(req,res)=>{
    // console.log(req.body.url)
   let urlFromClient=req.body.url
   let maxPages=req.body.maxPages
   let maxDepth=req.body.maxDepth
    // console.log(req.body.maxPages)
    // console.log(req.body.maxDepth)
    // const temp=JSON.parse(req.body)
    // console.log('temp-',temp)
    main(urlFromClient,maxPages,maxDepth)
    res.send({hello:'hello'})
})


async function main(url,maxPages,maxDepth){
    console.log(url,'maxD',maxDepth,'maxPages',maxPages)
    let linksToVisit=[url]
    const visitedLinks=[]
    let namesList=[]
    let images=[]
    let pagesCount=0
    let pagesDepth=0
   
const browser=await puppeteer.launch({
    headless:false,
    defaultViewport:{width:1110,height:1080}
});
const page=await browser.newPage();
await page.goto('https://www.linkedin.com/login')
await page.type('#username','ofer3klein@gmail.com')
await page.type('#password','ofer3k1998')
let name='first'
let img=''


await page.click('.btn__primary--large.from__button--floating')
await sleep(3000)
//  express
app.get('/', (req, res) => {
        res.send(namesList)
        })   
app.get('/images', (req, res) => {
            res.send(images)
        })  


while(linksToVisit.length>0&&pagesCount<maxPages&&pagesDepth<maxDepth*5){
    pagesCount++;
    pagesDepth++
    const currentUrl=linksToVisit.pop()
    if(visitedLinks.includes(currentUrl)) continue
    await page.goto('https://www.linkedin.com'+currentUrl)
    await sleep(3500)
    const htmlContent=await page.content()
    const $=cheerio.load(htmlContent)
    await sleep(3500)
    // pump the name
    for(let i=1;i<1000;i++){
        let current='#ember'+i
        if($(current).attr('title')==undefined)continue
        else{
            name=$(current).attr('title')
            img=$(current).attr('src')
            console.log(img)
            break;
        }
    }
    //  name=$('#ember47').attr('title')
    //  let job=$('mt1.t-18.t-black.t-normal.break-words')
    //  console.log(job)
     if(name!==undefined)
     namesList.push(name)
     images.push(img)
    const newLinksToVisit=$('.pv-browsemap-section__member')
                            .map((index,element)=>$(element)
                            .attr('href'))
                            .get()
    console.log('links- ',...newLinksToVisit)
    linksToVisit=[...linksToVisit,...newLinksToVisit]
    
    visitedLinks.push(currentUrl)
    await sleep(2000)
}
if(pagesCount===maxPages){
    console.log('By your call, the crawler stoped his work at page number-',maxPages)
}
if(pagesDepth===maxDepth*5)
console.log('the crawler has reached ma depth ',maxDepth)
}

// main()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })
async function sleep(miliseconds){
    return new Promise((resolve)=>setTimeout(resolve,miliseconds))
}

