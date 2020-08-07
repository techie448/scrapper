const axios = require('axios');
const getJobs = async (query, test) => {
    const getData = async (url) => {
        let data;
        try{
            const response = await axios.get(url);
            data = response.data;

        }catch(err){
            console.log(`ERROR : ${err.config.url}`)
            return [];
        }
        const organicData = data.filter(res => !res.hasOwnProperty('InlineApasAd'))
        return organicData.map(job => ({
            id: job.musangKingId,
            title: job.Title,
            company: job.Company.Name,
            location: job.LocationText,
            created: new Date(job.DatePosted),
            apply: job.TitleLink,
            source: "Monster",
        }));
    }
    const search = query.split(" ").join("-");
    let page = 1;
    let run = true;
    const jobs = [];
    while(run && page<1000){
        const url = `https://www.monster.ca/jobs/search/pagination/?q=${search}&tm=14&stpage=1&isDynamicPage=true&isMKPagination=true&page=${page}&total=${page*25}`;
        const results = await getData(url);
        if(results.length>0) jobs.push(...results)
        else run = false;
        if(test) run=false;
        page+=1;
    }
    console.log({
        query,
        source: 'Monster',
        results: jobs.length
    });
    return jobs;
}
getJobs("Software Engineer", false)
