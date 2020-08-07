const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const getJobs = async (query, test) => {
    const getData = async (url) => {
        console.log(url);
        let data;
        try{
            const response = await axios.get(url);
            data = response.data;

        }catch(err){
            console.log(`ERROR : ${err.config.url}`)
            return [];
        }
        const $ = cheerio.load(data);
        const cards = $('article.JobCard');
        console.log(cards.length)
        const results = [];
        cards.each((_,card)=>{
            const $card = $(card);
            const title = $card.find('h2').text().trim();
            const company = $card.find('.JobCard-company').text().trim();
            const location = $card.find('.JobCard-location').text().replace("—","").trim();
            const created = new Date($card.find('time').attr('datetime'));
            const apply = `https://www.workopolis.com${$card.find('a').attr('href')}`;
            const id = $card.attr('data-jobkey');
            const source = "Workopolis";

            const data = {id, title, apply, location, company, created, source};
            results.push(data);
        })
        console.log(results[results.length-1].title)
        return results;
    }
    const search = query.split(" ").join("+");
    let page = 1;
    let run = true;
    const jobs = [];
    while(run && page<50){
        const url = `https://www.workopolis.com/jobsearch/find-jobs?ak=${search}&l=Canada&lg=en&pn=${page}&st=true`;
        const results = await getData(url);
        if(results.length>0) jobs.push(...results)
        else run = false;
        if(test) run=false;
        page+=1;
        console.log(jobs.length)
    }
    console.log({
        query,
        source: 'Workopolis',
        results: jobs.length
    });
    return jobs;
}
getJobs("Software Engineer", false)
