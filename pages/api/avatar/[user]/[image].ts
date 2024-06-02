import { isEmpty } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
const axios = require('axios');
type ResponseData = {
  message: string
}
const IMAGE_HOST = "https://s3.cloudfly.vn/avatar";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  
  const {user, image} = req.query;
  if (isEmpty(user) || isEmpty(image)) {
    res.status(403).json({message: 'Forbiden'});
  } else {
    try {
       
        const URL = `${IMAGE_HOST}/${user}/${image}`;
        let i = await axios.get(URL, {responseType: 'arraybuffer'});
        const header = i.headers['content-type'] || "image/jpg";
        const prefix = `data:${header};base64,`
        const data = Buffer.from(i.data, "binary");
        let returnedB64 = data.toString('base64');
        res.status(200).json({ message: prefix + returnedB64 });
    } catch(e: any) {
        res.status(500).json({message: "Internal Server Error"});
    }
  }
  
}