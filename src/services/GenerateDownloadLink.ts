'use server'
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET!;



export const  generateSecureDownloadLink = async(fileId : string, expiresInSeconds = 60 * 5) => {

    return jwt.sign({ fileId  }, JWT_SECRET, { expiresIn: expiresInSeconds });

}