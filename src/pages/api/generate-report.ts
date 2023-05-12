// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Data = {
  name: string
}

const makeRequest = async (url: string) => {
  try {
    const response = await axios.get(url);
    const urlSegments = url.split('/');
    const finalSegment = urlSegments[urlSegments.length - 1];
    return { url: finalSegment, result: response.data };
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error);
    return null;
  }
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {

  //TODO: change url paths 
  const urls = [
    `http://${req.headers.host}/api/geo-mismatch`,
    `http://${req.headers.host}/api/no-coach`,
    `http://${req.headers.host}/api/coach-not-in-CBO`,
    `http://${req.headers.host}/api/over-coaching`,
    `http://${req.headers.host}/api/talent-group-mismatch`,
    `http://${req.headers.host}/api/geo-and-talent-mismatch`,
    `http://${req.headers.host}/api/under-coaching`,
    `http://${req.headers.host}/api/all-coaches`,
  ];

  // Create an array of promises for each URL
  const requests = urls.map((url) => makeRequest(url));

  // Use Promise.all to make all requests concurrently
  const results = await Promise.all(requests);
  
  // Filter out null results
  const validResults = results
  .filter((result) => result !== null)
  .reduce((accumulator, currentValue) => {
    accumulator[currentValue.url] = currentValue.result;
    return accumulator;
  }, {});

  res.status(200).json(validResults)
}
