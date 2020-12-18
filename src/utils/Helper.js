import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

import moment from 'moment';
import 'moment/locale/sv';

export const convertYearMonth = (monthYear) => {
    const m = moment(monthYear)
    return m.format("MMMM") + " " + m.format("YYYY")
}

export const getCookieByName = (cookieName) => {
    const cookies = getCookies();
    return cookies[cookieName];
}

export const getCookiesByName = (cookieNames = null) => {
    const cookies = getCookies();

    if (cookieNames) {
        return Object.keys(cookies)
            .filter(c => cookieNames.includes(c))
            .reduce((acc, curr) => {
                const keyValuePair = curr.split('=');
                acc[keyValuePair[0]] = keyValuePair[1];
                return acc; 
            })
    }
    return cookies;
}

export const cookiesExist = (cookieNames) => {
    if (Array.isArray(cookieNames)) {
        const cookies = getCookies();
        return cookieNames.every(cookieName => Object.keys(cookies).includes(cookieName))
    }
    return
}

const getCookies = () => {
    const cookieString = document.cookie;
    const cookieList = cookieString.split(';').map(cookie => cookie.trim())
    
    return cookieList.reduce((acc, curr) => {
        const keyValuePair = curr.split('=');
        acc[keyValuePair[0]] = keyValuePair[1];
        return acc;
    }, {})
}

export const setUpGoogleAnalytics = () => {
    ReactGA.initialize("UA-168369549-1");
    const history = createBrowserHistory();
    history.listen(location => {
        ReactGA.set({ page: location.pathname }); // Update the user's current page
        ReactGA.pageview(location.pathname); // Record a pageview for the given page
    });
}

export const getAllElectionYears = (parties) => {
    let years = []
    Object.values(parties).forEach(p => years = Array.from(new Set([...years, ...Object.keys(p['riksdagsval'])]))); //Create array of unique years
    return years.sort().reverse()
} 

export const getAllOpinionMonths = (parties) => {
    let months = []
    Object.values(parties).forEach(p => months = Array.from(new Set([...months, ...Object.keys(p['opinionsundersökningar'])]))) //Create array of unique months
    return months.sort().reverse()
}