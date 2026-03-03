import { initDataFast } from 'datafast';

let datafast: any = null;

export async function getAnalytics() {
    if (!datafast) {
        datafast = await initDataFast({
            websiteId: process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID!,
            domain: process.env.NEXT_PUBLIC_DATAFAST_DOMAIN,
            autoCapturePageviews: true,
        });
    }
    return datafast;
}
