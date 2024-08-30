import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Detect if the URL is a TikTok link
    const isTikTok = /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/.test(url);

    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract metadata
    let previewData;

    if (isTikTok) {
      // TikTok-specific parsing
      const title = $('h1[data-e2e="user-title"]').text() || 'TikTok Video';
      const description = $('meta[property="og:description"]').attr('content') || 'TikTok Video Description';

      // Attempt to extract the image from alternative locations
      let image = $('meta[property="og:image"]').attr('content') || '';

      // Alternative method: Check if there's a script tag with JSON data that includes the image
      if (!image) {
        const jsonScript = $('script[type="application/ld+json"]').html();
        if (jsonScript) {
          const jsonData = JSON.parse(jsonScript);
          image = jsonData?.thumbnailUrl || '';
        }
      }

      previewData = { title, description, image, url };
    } else {
      // General metadata extraction for non-TikTok links
      previewData = {
        title: 
          $('meta[property="og:title"]').attr('content') || 
          $('meta[name="twitter:title"]').attr('content') || 
          $('title').text() || 
          'No title available',
          
        description: 
          $('meta[property="og:description"]').attr('content') || 
          $('meta[name="twitter:description"]').attr('content') || 
          $('meta[name="description"]').attr('content') || 
          'No description available',
          
        image: 
          $('meta[property="og:image"]').attr('content') || 
          $('meta[name="twitter:image"]').attr('content') || 
          $('link[rel="image_src"]').attr('href') || 
          '',
          
        url: url,
      };
    }
    res.status(200).send(previewData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the preview' });
  }
}
