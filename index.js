const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const getJobs = async (query, test) => {
    const getData = async (url) => {
        console.log(url)
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const cards = $('.result-card');
        console.log(cards.length)
        const results = [];
        cards.each((_,card)=>{
            const $card = $(card);
            const title = $card.find('h3').text().trim();
            const company = $card.find('h4').text().trim();
            const location = $card.find('.job-result-card__location').text();
            const created = $card.find('time').text();
            const apply = `${$card.find('a').attr('href')}`;
            const id = $card.attr('data-id');
            const source = "LinkedIn";
            const data = {id, title, apply, location, company, created, source};
            results.push( data );
        })
        return results;
    }
    const search = query.split(" ").join("+");
    let page = 0;
    let run = true;
    const jobs = [];
    while(run && page<1000){
        const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${search}&location=Canada&sortBy=DD&start=${page}`;
        const results = await getData(url);
        if(results.length>0) jobs.push(...results)
        else run = false;
        if(test) run=false;
        page+=25;
        console.log(results.length)
    }
    console.log({
        query,
        source: 'linkedin',
        results: jobs.length
    });
return jobs;
}
getJobs("Software Engineer", false)
