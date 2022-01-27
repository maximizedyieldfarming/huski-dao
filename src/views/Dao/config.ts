interface Funders {
    name: string,
    image: string,
    description: string,
}
interface Dates {
    phase1: string,
    phase2: string,
    phase3: string,
}
export const funders: Array<Funders> = [{
    name: 'mike',
    image: 'https://avatars2.githubusercontent.com/u/12097?s=460&v=4',
    description: 'mike is a founder of the company'
}]

export const dates = {
    phase1: '2018-01-01',
    phase2: '2018-02-01',
    phase3: '2018-03-01',
}